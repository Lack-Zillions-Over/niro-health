import type { INestApplication } from '@nestjs/common';
import { UserDatabaseContract } from '@app/users/contracts';
import { CoreRepositoryContract } from '@app/core/contracts/coreRepository';
import { User } from '@app/users/entities';
import type { EntityWithRelation } from '@app/users/types/entityWithRelation';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import type { GeoIP } from '@app/core/types/geo-ip.type';
import type { IRandomService } from '@app/random';
import type { Ii18nService } from '@app/i18n';
import type { IJsonWebTokenService } from '@app/json-web-token';

export class UserRepository extends CoreRepositoryContract {
  private readonly _randomService: IRandomService;
  private readonly _i18nService: Ii18nService;
  private readonly _jsonWebTokenService: IJsonWebTokenService;

  constructor(
    protected readonly database: UserDatabaseContract,
    protected readonly app: INestApplication,
  ) {
    super(database);
    this._randomService = this.app.get<IRandomService>('IRandomService');
    this._i18nService = this.app.get<Ii18nService>('Ii18nService');
    this._jsonWebTokenService = this.app.get<IJsonWebTokenService>(
      'IJsonWebTokenService',
    );
  }

  private get _signature(): string {
    return this._randomService.string(12, { specials: ['-', '_'] });
  }

  private get _getExpireDateAccessToken() {
    return ((now) => {
      now.setMinutes(now.getMinutes() + 15); // ! 15 minutes
      return now.toISOString();
    })(new Date());
  }

  private get _getExpireDateAccessTokenRevalidate() {
    return ((now) => {
      now.setDate(now.getDate() + 1); // ! 1 day
      return now.toISOString();
    })(new Date());
  }

  private get _getJsonWebTokenData() {
    return {
      timestamp: `${Date.now()}-${this.database.generateUUID()}`,
    };
  }

  private _sessionDefault(user: User) {
    let { session } = user;

    session = {
      activeClients: 0,
      limitClients: 4,
      accessTokens: [],
      accessTokenRevalidate: null,
      history: {
        devices: [],
        accessTokensCanceled: [],
        loginInNewIpAddressAlerts: [],
      },
      allowedDevices: [],
      loginFailure: {
        attemptsCount: 0,
        attemptsLimit: 5,
        attemptsTimeout: null,
      },
      geoip: [],
      banned: false,
      ipAddressWhitelist: [],
      ipAddressBlacklist: [],
    };

    return session;
  }

  private async _loginFailureProcessAttempt(user: User) {
    let {
      session: { loginFailure },
    } = user;

    if (!loginFailure)
      loginFailure = {
        attemptsCount: 0,
        attemptsLimit: 5,
      };

    loginFailure.attemptsCount++;

    return loginFailure;
  }

  private async _loginFailureCheckIsExceedAttempts(
    loginFailure: User['session']['loginFailure'],
  ) {
    if (!loginFailure)
      loginFailure = {
        attemptsCount: 0,
        attemptsLimit: 5,
      };

    if (loginFailure.attemptsCount >= loginFailure.attemptsLimit) {
      if (typeof loginFailure.attemptsTimeout !== 'string') {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 20);
        loginFailure.attemptsTimeout = now.toISOString();
      } else {
        if (new Date(loginFailure.attemptsTimeout) > new Date())
          return new Error(
            (await this._i18nService.translate(
              'users.repository.session_inactive',
            )) as string,
          );

        loginFailure.attemptsTimeout = null;
      }
    }

    return loginFailure;
  }

  private _loginFailureReset(user: User) {
    let {
      session: { loginFailure },
    } = user;

    loginFailure = {
      attemptsCount: 0,
      attemptsLimit: 5,
      attemptsTimeout: null,
    };

    return loginFailure;
  }

  private _addedAccessToken(user: User, ipAddress: string) {
    const {
      session: { accessTokens },
    } = user;

    accessTokens.push({
      value: this._jsonWebTokenService.save(
        this._getJsonWebTokenData,
        user.password,
        '15m',
      ) as string,
      signature: this._signature,
      expireIn: this._getExpireDateAccessToken,
      createdAt: new Date().toISOString(),
      ipAddress,
    });

    return accessTokens;
  }

  private _addedAccessTokenRevalidate(user: User, ipAddress: string) {
    let {
      session: { accessTokenRevalidate },
    } = user;

    if (
      !accessTokenRevalidate ||
      new Date(accessTokenRevalidate.expireIn) < new Date()
    )
      accessTokenRevalidate = {
        value: this._jsonWebTokenService.save(
          this._getJsonWebTokenData,
          user.password,
          '1d',
        ) as string,
        signature: this._signature,
        expireIn: this._getExpireDateAccessTokenRevalidate,
        createdAt: new Date().toISOString(),
        ipAddress,
      };

    return accessTokenRevalidate;
  }

  private _addedDeviceHistory(
    user: User,
    name: string,
    accessTokenValue: string,
    ipAddress: string,
  ) {
    const {
      session: {
        history: { devices },
      },
    } = user;

    devices.push({
      name,
      accessTokenValue,
      ipAddress,
    });

    return devices;
  }

  private _updateHashFields(
    fields: string[],
    beforeData: User,
    nextData: RecursivePartial<User>,
  ) {
    for (const field of fields) {
      if (
        beforeData[field] !== nextData[field] &&
        !this.database.compareHashText(nextData[field], beforeData.hash[field])
      ) {
        nextData[field] = this.database.encrypt(nextData[field]);
        nextData.hash[field] = this.database.hashText(nextData[field]);
      }
    }

    return nextData;
  }

  private async _findBySameField(field: string, value: string) {
    if ((await this.database.findBy({ [field]: value })).length > 0)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_already_exists',
          field,
          value,
        )) as string,
      );
  }

  private async _findBySameFieldExceptionWithID(
    id: string,
    field: string,
    value: string,
  ) {
    if (
      (await this.database.findBy({ [field]: value })).filter(
        (user) => user.id !== id,
      ).length > 0
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.field_in_use',
          field,
          value,
        )) as string,
      );
  }

  public async beforeSave(user: User): Promise<User> {
    user.email = await this.database.encrypt(user.email);
    user.password = await this.database.hashPassword(user.password);

    return user;
  }

  public async beforeUpdate(
    beforeData: User,
    nextData: RecursivePartial<User>,
  ): Promise<User> {
    if (
      beforeData.password !== nextData.password &&
      !(await this.database.compareHashPassword(
        nextData.password,
        beforeData.password,
      ))
    )
      nextData.password = await this.database.hashPassword(nextData.password);

    nextData = this._updateHashFields(['email'], beforeData, nextData);

    return { ...beforeData, ...nextData } as User;
  }

  public async create(user: User): Promise<EntityWithRelation | Error> {
    const findByUsername = await this._findBySameField(
      'username',
      user.username,
    );

    if (findByUsername instanceof Error)
      return new Error(findByUsername.message);

    const findByEmail = await this.database.findByEmail(user.email);

    if (findByEmail)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_already_exists',
          'email',
          user.email,
        )) as string,
      );

    return (await this.database.create(
      await this.beforeSave(user),
    )) as EntityWithRelation;
  }

  public async findAll(
    limit?: number,
    skip?: number,
  ): Promise<EntityWithRelation[]> {
    return (await this.database.findAll(limit, skip)) as EntityWithRelation[];
  }

  public async findById(id: string): Promise<EntityWithRelation | Error> {
    const user = await this.database.findOne(id);

    if (!user)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_not_exists',
          'id',
          id,
        )) as string,
      );

    return user as EntityWithRelation;
  }

  public async findBy(
    filter: RecursivePartial<EntityWithRelation>,
    similarity?: Type,
  ): Promise<EntityWithRelation[]> {
    return (await this.database.findBy(
      filter,
      similarity,
    )) as EntityWithRelation[];
  }

  public async update(
    id: string,
    newData: RecursivePartial<User>,
  ): Promise<EntityWithRelation | Error> {
    const user = await this.findById(id);

    if (user instanceof Error) return new Error(user.message);

    const findByUsername = await this._findBySameFieldExceptionWithID(
      newData.id as string,
      'username',
      newData.username,
    );

    if (findByUsername instanceof Error)
      return new Error(findByUsername.message);

    if (
      ((user) => (user ? user.id !== newData.id : false))(
        await this.database.findByEmail(newData.email),
      )
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.field_in_use',
          'email',
          newData.email,
        )) as string,
      );

    return (await this.database.update(
      id,
      await this.beforeUpdate(user, newData),
    )) as EntityWithRelation;
  }

  public async delete(id: string): Promise<boolean | Error> {
    return (await this.database.delete(id))
      ? true
      : new Error('User not found');
  }

  public async login(
    email: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
  ): Promise<EntityWithRelation | Error> {
    let user = await this.database.findByEmail(email);

    if (!user)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_not_exists',
          'email',
          email,
        )) as string,
      );

    if (!user.activate)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_account_not_activate',
        )) as string,
      );

    if (!user.session) user.session = this._sessionDefault(user);

    let loginFailure;

    if (!(await this.database.compareHashPassword(password, user.password))) {
      loginFailure = await this._loginFailureProcessAttempt(user);
      loginFailure = await this._loginFailureCheckIsExceedAttempts(
        loginFailure,
      );

      if (loginFailure instanceof Error) return new Error(loginFailure.message);

      user.session.loginFailure = loginFailure;

      await this.update(user.id as string, user);

      return new Error(
        (await this._i18nService.translate(
          'users.repository.password_incorrect',
        )) as string,
      );
    }

    loginFailure = await this._loginFailureCheckIsExceedAttempts(
      user.session.loginFailure,
    );

    if (loginFailure instanceof Error) return new Error(loginFailure.message);

    user.session.loginFailure = this._loginFailureReset(user);

    if (user.session.banned)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_is_banned',
          'email',
          email,
        )) as string,
      );

    if (user.session.activeClients >= user.session.limitClients) {
      let userUpdated;

      for (const token of user.session.accessTokens) {
        if (new Date(token.expireIn) < new Date())
          userUpdated = await this.logout(user.id as string, token.value);
      }

      if (userUpdated instanceof Error) return new Error(userUpdated.message);

      if (
        !userUpdated ||
        (userUpdated &&
          userUpdated.session.activeClients >= userUpdated.session.limitClients)
      )
        return new Error(
          (await this._i18nService.translate(
            'users.repository.user_session_exceed_limit',
            'email',
            email,
            user.session.limitClients.toString(),
          )) as string,
        );

      if (userUpdated) user = userUpdated;
    }

    if (
      user.session.ipAddressWhitelist.length > 0 &&
      user.session.ipAddressWhitelist.indexOf(geo_ip.ipAddress) <= -1
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_session_ipAddress_not_allowed',
          geo_ip.ipAddress,
        )) as string,
      );

    if (
      user.session.ipAddressBlacklist.length > 0 &&
      user.session.ipAddressBlacklist.indexOf(geo_ip.ipAddress) !== -1
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_session_ipAddress_is_blocked',
          geo_ip.ipAddress,
        )) as string,
      );

    if (
      user.session.allowedDevices.length > 0 &&
      user.session.allowedDevices.indexOf(device_name) <= 0
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_session_device_not_allowed',
          device_name,
        )) as string,
      );

    if (
      user.session.accessTokens.find(
        (token) => token.ipAddress === geo_ip.ipAddress,
      )
    ) {
      await this.logout(
        user.id as string,
        user.session.accessTokens.find(
          (token) => token.ipAddress === geo_ip.ipAddress,
        ).value,
      );
    }

    user.session.activeClients++;
    user.session.accessTokens = this._addedAccessToken(user, geo_ip.ipAddress);
    user.session.accessTokenRevalidate = this._addedAccessTokenRevalidate(
      user,
      geo_ip.ipAddress,
    );

    user.session.history.devices = this._addedDeviceHistory(
      user,
      device_name,
      user.session.accessTokens.at(-1).value,
      geo_ip.ipAddress,
    );

    user.session.geoip.push({
      ...geo_ip,
      token_signature: user.session.accessTokens.at(-1).signature,
    });

    if (
      user.session.history.loginInNewIpAddressAlerts.indexOf(
        geo_ip.ipAddress,
      ) === -1
    ) {
      // TODO: Added e-mail alert in queue send mails
      // ! The user logged in new IP not secure, his confirm?

      user.session.history.loginInNewIpAddressAlerts.push(geo_ip.ipAddress);
    }

    return (await this.database.update(user.id, user)) as EntityWithRelation;
  }

  public async sessionValidate(
    id: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
  ) {
    const user = await this.database.findOne(id);

    if (!user)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_not_exists',
          'id',
          id,
        )) as string,
      );

    const email = await this.database.decrypt(user.email);

    if (user.session.activeClients <= 0)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.users_not_connected',
          'email',
          email,
        )) as string,
      );

    if (
      user.session.history.accessTokensCanceled.find(
        (token) => token.value === token_value,
      )
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.session_canceled',
        )) as string,
      );

    if (
      !user.session.geoip.find(
        (geoip) => geoip.token_signature === token_signature,
      ) ||
      ((geoip) => {
        if (
          geoip.city !== geo_ip.city ||
          geoip.country !== geo_ip.country ||
          geoip.ipAddress !== geo_ip.ipAddress ||
          geoip.region !== geo_ip.region ||
          geoip.timezone !== geo_ip.timezone
        )
          return true;

        return false;
      })(
        user.session.geoip.find(
          (geoip) => geoip.token_signature === token_signature,
        ),
      )
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.session_geoip_not_equal_stored',
        )) as string,
      );

    const accessToken = user.session.accessTokens.find(
      (token) =>
        token.value === token_value && token.signature === token_signature,
    );

    if (!accessToken)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_not_connected',
          'email',
          email,
        )) as string,
      );

    if (accessToken.ipAddress !== geo_ip.ipAddress) {
      return new Error(
        (await this._i18nService.translate(
          'users.repository.session_access_token_is_not_same_ip_address',
          geo_ip.ipAddress,
        )) as string,
      );
    }

    if (
      !user.session.history.devices.find(
        (device) =>
          device.name === device_name &&
          device.accessTokenValue === accessToken.value &&
          device.ipAddress === geo_ip.ipAddress,
      )
    )
      return new Error(
        (await this._i18nService.translate(
          'users.repository.session_device_is_not_same_in_history',
          device_name,
        )) as string,
      );

    if (
      new Date(accessToken.expireIn) < new Date() ||
      this._jsonWebTokenService.load(
        accessToken.value,
        user.password,
      ) instanceof Error
    ) {
      const { accessTokenRevalidate } = user.session;

      if (new Date(accessTokenRevalidate.expireIn) > new Date()) {
        if (
          accessTokenRevalidate.value !== token_revalidate_value ||
          accessTokenRevalidate.signature !== token_revalidate_signature
        ) {
          await this.logout(id, token_value);

          return new Error(
            (await this._i18nService.translate(
              'users.repository.session_token_revalidate_is_invalid',
            )) as string,
          );
        }

        if (accessTokenRevalidate.ipAddress !== geo_ip.ipAddress) {
          await this.logout(id, token_value);

          return new Error(
            (await this._i18nService.translate(
              'users.repository.session_token_revalidate_ipAddress_is_not_stored',
              geo_ip.ipAddress,
            )) as string,
          );
        }

        const token_canceled = user.session.accessTokens.find(
          (token) => token.value === token_value,
        );

        if (token_canceled)
          user.session.history.accessTokensCanceled.push(token_canceled);

        user.session.accessTokens = user.session.accessTokens.filter(
          (token) => token.value !== token_value,
        );

        user.session.accessTokens = this._addedAccessToken(
          user,
          geo_ip.ipAddress,
        );

        for (const geoip of user.session.geoip) {
          if (geoip.token_signature === token_canceled.signature) {
            geoip.token_signature = user.session.accessTokens.at(-1).signature;
          }
        }

        for (const device of user.session.history.devices) {
          if (device.accessTokenValue === token_canceled.value) {
            device.accessTokenValue = user.session.accessTokens.at(-1).value;
          }
        }

        const userUpdated = await this.update(id, user);

        if (userUpdated instanceof Error) return new Error(userUpdated.message);

        return {
          token_value: userUpdated.session.accessTokens.at(-1).value,
          token_signature: userUpdated.session.accessTokens.at(-1).signature,
        };
      }

      await this.logout(id, token_value);

      return new Error(
        (await this._i18nService.translate(
          'users.repository.session_access_token_expired',
        )) as string,
      );
    } else {
      return {
        token_value: user.session.accessTokens.find(
          (token) => token.value === token_value,
        ).value,
        token_signature: user.session.accessTokens.find(
          (token) => token.value === token_value,
        ).signature,
      };
    }
  }

  public async logout(id: string, token_value: string) {
    const user = await this.database.findOne(id);

    if (!user)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_not_exists',
          'id',
          id,
        )) as string,
      );

    if (!user.session)
      return new Error(
        (await this._i18nService.translate(
          'users.repository.user_not_connected',
          'id',
          id,
        )) as string,
      );

    user.session.history.accessTokensCanceled =
      user.session.history.accessTokensCanceled.filter(
        (token) => new Date() < new Date(token.expireIn),
      );

    const token_canceled = user.session.accessTokens.find(
      (token) => token.value === token_value,
    );

    if (token_canceled)
      user.session.history.accessTokensCanceled.push(token_canceled);

    user.session.history.devices = user.session.history.devices.filter(
      (device) => device.accessTokenValue !== token_value,
    );

    if (user.session.activeClients > 0) user.session.activeClients -= 1;
    user.session.geoip = user.session.geoip.filter(
      (geoip) =>
        geoip.token_signature !==
        user.session.accessTokens.find((token) => token.value === token_value)
          .signature,
    );

    if (user.session.activeClients <= 0)
      user.session.accessTokenRevalidate = null;

    user.session.accessTokens = user.session.accessTokens.filter(
      (token) => token.value !== token_value,
    );

    return await this.update(user.id as string, user);
  }
}
