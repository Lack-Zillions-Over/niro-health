import { UserDatabaseContract } from '@/users/contracts/users-database.contract';

import { Locale } from '@/core/libs/i18n.lib';

import { User } from '@/users/entities/users.entity';
import { GeoIP } from '@/core/types/geo-ip.type';

import { JsonWebToken } from '@/core/libs/jwt.lib';
import { Random } from '@/core/utils/random.util';

export class UserRepository {
  constructor(
    protected database: UserDatabaseContract,
    private readonly locale: Locale,
  ) {}

  private _signature(): string {
    return Random.STRING(12);
  }

  private _getExpireDateAccessToken() {
    return ((now) => {
      now.setMinutes(now.getMinutes() + 15);
      return now.toISOString();
    })(new Date());
  }
  private _getExpireDateAccessTokenRevalidate() {
    return ((now) => {
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    })(new Date());
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
      geoip: null,
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
            this.locale.translate(
              'users.repository.session_inactive',
            ) as string,
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

    const jwt = new JsonWebToken({ id: user.id, username: user.username });

    accessTokens.push({
      value: jwt.save(user.password, '15m') as string,
      signature: this._signature(),
      ipAddress,
      expireIn: this._getExpireDateAccessToken(),
      createdAt: new Date().toISOString(),
    });

    return accessTokens;
  }

  private _addedAccessTokenRevalidate(user: User, ipAddress: string) {
    let {
      session: { accessTokenRevalidate },
    } = user;

    const jwt = new JsonWebToken({ id: user.id, username: user.username });

    if (
      !accessTokenRevalidate ||
      new Date(accessTokenRevalidate.expireIn) < new Date()
    )
      accessTokenRevalidate = {
        value: jwt.save(user.password, '1d') as string,
        signature: this._signature(),
        ipAddress,
        expireIn: this._getExpireDateAccessTokenRevalidate(),
        createdAt: new Date().toISOString(),
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

  private async _beforeSave(user: User): Promise<User> {
    user.email = this.database.encrypt(user.email);
    user.password = await this.database.hashByPassword(user.password);

    return user;
  }

  private async _beforeUpdate(beforeData: User, nextData: User): Promise<User> {
    if (
      beforeData.email !== nextData.email &&
      !this.database.compareHashText(nextData.email, beforeData.hash.email)
    )
      nextData.email = this.database.encrypt(beforeData.email);

    if (
      beforeData.password !== nextData.password &&
      !(await this.database.compareHashPassword(
        nextData.password,
        beforeData.password,
      ))
    )
      nextData.password = await this.database.hashByPassword(
        beforeData.password,
      );

    return nextData;
  }

  async register(user: User): Promise<Error | User> {
    if (await this.database.findByUsername(user.username))
      return new Error(
        this.locale.translate(
          'users.repository.user_already_exists',
          'username',
          user.username,
        ) as string,
      );

    if (await this.database.findByEmail(user.email))
      return new Error(
        this.locale.translate(
          'users.repository.user_already_exists',
          'email',
          user.email,
        ) as string,
      );

    return await this.database.create(await this._beforeSave(user));
  }

  async findMany(): Promise<User[]> {
    return await this.database.findAll();
  }

  async findById(id: string): Promise<Error | User> {
    const user = await this.database.findOne(id);

    if (!user)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_exists',
          'id',
          id,
        ) as string,
      );

    return user;
  }

  async findByUsername(username: string): Promise<Error | User> {
    const user = await this.database.findByUsername(username);

    if (!user)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_exists',
          'username',
          username,
        ) as string,
      );

    return user;
  }

  async update(id: string, newData: User): Promise<Error | User> {
    const user = await this.findById(id);

    if (user instanceof Error) return new Error(user.message);

    if (
      ((user) => (user ? user.id !== newData.id : false))(
        await this.database.findByUsername(newData.username),
      )
    )
      return new Error(
        this.locale.translate(
          'users.repository.field_in_use',
          'username',
          newData.username,
        ) as string,
      );

    if (
      ((user) => (user ? user.id !== newData.id : false))(
        await this.database.findByEmail(newData.email),
      )
    )
      return new Error(
        this.locale.translate(
          'users.repository.field_in_use',
          'email',
          newData.email,
        ) as string,
      );

    return await this.database.update(
      id,
      await this._beforeUpdate(user, { ...newData }),
    );
  }

  async remove(id: string): Promise<Error | boolean> {
    const user = await this.findById(id);

    if (user instanceof Error) return new Error(user.message);

    return await this.database.remove(user.id);
  }

  async login(
    username: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
  ): Promise<Error | User> {
    const user = await this.database.findByUsername(username);

    if (!user)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_exists',
          'username',
          username,
        ) as string,
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

      await this.update(user.id, user);

      return new Error(
        this.locale.translate('users.repository.password_incorrect') as string,
      );
    }

    loginFailure = await this._loginFailureCheckIsExceedAttempts(
      user.session.loginFailure,
    );

    if (loginFailure instanceof Error) return new Error(loginFailure.message);

    user.session.loginFailure = this._loginFailureReset(user);

    if (user.session.banned)
      return new Error(
        this.locale.translate(
          'users.repository.user_is_banned',
          'username',
          username,
        ) as string,
      );

    if (user.session.activeClients >= user.session.limitClients)
      return new Error(
        this.locale.translate(
          'users.repository.user_session_exceed_limit',
          'username',
          username,
        ) as string,
      );

    if (
      user.session.ipAddressWhitelist.length > 0 &&
      user.session.ipAddressWhitelist.indexOf(geo_ip.ipAddress) <= -1
    )
      return new Error(
        this.locale.translate(
          'users.repository.user_session_ipAddress_not_allowed',
          geo_ip.ipAddress,
        ) as string,
      );

    if (
      user.session.ipAddressBlacklist.length > 0 &&
      user.session.ipAddressBlacklist.indexOf(geo_ip.ipAddress) !== -1
    )
      return new Error(
        this.locale.translate(
          'users.repository.user_session_ipAddress_is_blocked',
          geo_ip.ipAddress,
        ) as string,
      );

    if (
      user.session.allowedDevices.length > 0 &&
      user.session.allowedDevices.indexOf(device_name) <= 0
    )
      return new Error(
        this.locale.translate(
          'users.repository.user_session_device_not_allowed',
          device_name,
        ) as string,
      );

    if (
      user.session.accessTokens.find(
        (token) => token.ipAddress === geo_ip.ipAddress,
      )
    )
      return new Error(
        this.locale.translate(
          'users.repository.user_session_ipAddress_already_connected',
          geo_ip.ipAddress,
        ) as string,
      );

    user.session.activeClients++;
    user.session.geoip = geo_ip;
    user.session.accessTokens = this._addedAccessToken(user, geo_ip.ipAddress);
    user.session.accessTokenRevalidate = this._addedAccessTokenRevalidate(
      user,
      geo_ip.ipAddress,
    );
    user.session.history.devices = this._addedDeviceHistory(
      user,
      device_name,
      user.session.accessTokens[user.session.accessTokens.length - 1].value,
      geo_ip.ipAddress,
    );

    if (
      user.session.history.loginInNewIpAddressAlerts.indexOf(
        geo_ip.ipAddress,
      ) === -1
    ) {
      // TODO: Added e-mail alert in queue send mails
      // ! The user logged in new IP not secure, his confirm?

      user.session.history.loginInNewIpAddressAlerts.push(geo_ip.ipAddress);
    }

    return await this.database.update(user.id, user);
  }

  public async sessionValidate(
    username: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
  ) {
    const user = await this.database.findByUsername(username);

    if (!user)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_exists',
          'username',
          username,
        ) as string,
      );

    if (!user.session)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_connected',
          'username',
          username,
        ) as string,
      );

    if (
      user.session.history.accessTokensCanceled.find(
        (token) => token.value === token_value,
      )
    )
      return new Error(
        this.locale.translate('users.repository.session_canceled') as string,
      );

    if (
      user.session.geoip.ipAddress !== geo_ip.ipAddress ||
      user.session.geoip.timezone !== geo_ip.timezone ||
      user.session.geoip.country !== geo_ip.country ||
      user.session.geoip.region !== geo_ip.region ||
      user.session.geoip.city !== geo_ip.city
    )
      return new Error(
        this.locale.translate(
          'users.repository.session_geoip_not_equal_stored',
        ) as string,
      );

    const jwt = new JsonWebToken({ id: user.id, username: user.username }),
      accessToken = user.session.accessTokens.find(
        (token) =>
          token.value === token_value && token.signature === token_signature,
      );

    if (!accessToken)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_connected',
          'username',
          username,
        ) as string,
      );

    if (accessToken.ipAddress !== geo_ip.ipAddress) {
      return new Error(
        this.locale.translate(
          'users.repository.session_access_token_is_not_same_ip_address',
          geo_ip.ipAddress,
        ) as string,
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
        this.locale.translate(
          'users.repository.session_device_is_not_same_in_history',
          device_name,
        ) as string,
      );

    if (
      new Date() > new Date(accessToken.expireIn) ||
      jwt.load(accessToken.value, user.password) instanceof Error
    ) {
      const { accessTokenRevalidate } = user.session;

      if (
        new Date() < new Date(accessTokenRevalidate.expireIn) ||
        !(jwt.load(accessTokenRevalidate.value, user.password) instanceof Error)
      ) {
        if (
          accessTokenRevalidate.value !== token_revalidate_value ||
          accessTokenRevalidate.signature !== token_revalidate_signature
        ) {
          await this.logout(username, token_value, device_name);

          return new Error(
            this.locale.translate(
              'users.repository.session_token_revalidate_is_invalid',
            ) as string,
          );
        }

        if (accessTokenRevalidate.ipAddress !== geo_ip.ipAddress) {
          await this.logout(username, token_value, device_name);

          return new Error(
            this.locale.translate(
              'users.repository.session_token_revalidate_ipAddress_is_not_stored',
              geo_ip.ipAddress,
            ) as string,
          );
        }
      }

      await this.logout(username, token_value, device_name);

      return new Error(
        this.locale.translate(
          'users.repository.session_access_token_expired',
        ) as string,
      );
    }
  }

  public async logout(
    username: string,
    token_value: string,
    device_name: string,
  ) {
    const user = await this.database.findByUsername(username);

    if (!user)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_exists',
          'username',
          username,
        ) as string,
      );

    if (!user.session)
      return new Error(
        this.locale.translate(
          'users.repository.user_not_connected',
          'username',
          username,
        ) as string,
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
      (device) => device.name !== device_name,
    );

    if (user.session.activeClients > 0) user.session.activeClients -= 1;
    user.session.geoip = null;
    user.session.accessTokenRevalidate = null;
    user.session.accessTokens = user.session.accessTokens.filter(
      (token) => token.value !== token_value,
    );

    return await this.update(user.id, user);
  }
}
