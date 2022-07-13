import { Locale } from '@/core/libs/i18n.lib';

import { CreateUser } from '@/users/usecases/create-users.usecase';
import { LoginUser } from '@/users/usecases/login-users.usecase';
import { LogoutUser } from '@/users/usecases/logout-users.usecase';
import { UserMemoryDB } from '@/users/db/users-memory.db';
import { User } from '@/users/entities/users.entity';

import { ValidateDateISO } from '@/core/validators/date-iso.validator';

const locale = new Locale();
const users: User[] = [];

describe(locale.translate('tests.users.usecases.logout.describe'), () => {
  it(
    locale.translate('tests.users.usecases.login.create_new_user') as string,
    async () => {
      const user = await CreateUser.execute(
        {
          username: 'GuilhermeSantos001',
          email: 'testing@testing.com',
          password: '123456',
        },
        new UserMemoryDB(users),
        locale,
      );

      expect(user instanceof Error).not.toBe(true);

      if (!(user instanceof Error)) {
        expect(user.id).toBeDefined();
        expect(user.email).not.toBe('testing@testing.com'); // This is encrypted
        expect(user.password).not.toBe('123456'); // This is encrypted
        expect(Object.values(user.hash)).not.toContain(undefined || null);
      }
    },
  );

  it(
    locale.translate(
      'tests.users.usecases.login.login_with_password_correct',
    ) as string,
    async () => {
      const user = await LoginUser.execute(
        'GuilhermeSantos001',
        '123456',
        'Desktop',
        {
          ipAddress: '192.168.0.1',
          city: 'São Paulo',
          country: 'Brazil',
          region: 'BR/SP',
          timezone: 'America/Sao_Paulo',
        },
        new UserMemoryDB(users),
        locale,
      );

      expect(user instanceof Error).not.toBe(true);

      if (!(user instanceof Error)) {
        const { session } = user;

        expect(session.activeClients).toBeGreaterThan(0);
        expect(session.accessTokens.length).toBeGreaterThan(0);
        expect(ValidateDateISO(session.accessTokens[0].expireIn)).toBe(true);
        expect(session.accessTokenRevalidate).toBeDefined();
        expect(ValidateDateISO(session.accessTokenRevalidate.expireIn)).toBe(
          true,
        );
        expect(
          Object.values(session.accessTokenRevalidate).filter((value) => !value)
            .length <= 0,
        ).toBe(true);
        expect(session.geoip).toBeDefined();
        expect(session.geoip).toStrictEqual({
          ipAddress: '192.168.0.1',
          city: 'São Paulo',
          country: 'Brazil',
          region: 'BR/SP',
          timezone: 'America/Sao_Paulo',
        });
        expect(session.limitClients).toEqual(4);
        expect(session.ipAddressBlacklist.length).toEqual(0);
        expect(session.ipAddressWhitelist.length).toEqual(0);
        expect(session.loginFailure).toBeDefined();
        expect(session.loginFailure).toStrictEqual({
          attemptsCount: 0,
          attemptsLimit: 5,
          attemptsTimeout: null,
        });
        expect(session.history.accessTokensCanceled.length).toEqual(0);
        expect(session.history.devices.length).toBeGreaterThan(0);
        expect(session.history.devices[0].accessTokenValue).toEqual(
          session.accessTokens[0].value,
        );
        expect(session.history.devices[0].ipAddress).toEqual('192.168.0.1');
        expect(session.history.devices[0].name).toEqual('Desktop');
        expect(session.history.loginInNewIpAddressAlerts).toContain(
          '192.168.0.1',
        );
      }
    },
  );

  it(
    locale.translate(
      'tests.users.usecases.logout.logout_valid_session',
    ) as string,
    async () => {
      const _users = JSON.parse(JSON.stringify(users));
      const token_value = _users[0].session.accessTokens[0].value;

      await expect(
        LogoutUser.execute(
          'GuilhermeSantos001',
          token_value,
          'Desktop',
          new UserMemoryDB(_users),
          locale,
        ),
      ).resolves.not.toThrowError();
    },
  );

  it(
    locale.translate(
      'tests.users.usecases.logout.not_logout_session_without_user',
    ) as string,
    async () => {
      const _users = JSON.parse(JSON.stringify(users));
      const token_value = _users[0].session.accessTokens[0].value;

      await expect(
        LogoutUser.execute(
          'GuilhermeSantos002',
          token_value,
          'Desktop',
          new UserMemoryDB(_users),
          locale,
        ),
      ).resolves.toThrowError(
        locale.translate(
          'users.repository.user_not_exists',
          'username',
          'GuilhermeSantos002',
        ) as string,
      );
    },
  );

  it(
    locale.translate(
      'tests.users.usecases.logout.not_logout_session_not_connected',
    ) as string,
    async () => {
      const _users = JSON.parse(JSON.stringify(users));

      _users[0].session = null;

      await expect(
        LogoutUser.execute(
          'GuilhermeSantos001',
          '???',
          'Desktop',
          new UserMemoryDB(_users),
          locale,
        ),
      ).resolves.toThrowError(
        locale.translate(
          'users.repository.user_not_connected',
          'username',
          'GuilhermeSantos001',
        ) as string,
      );
    },
  );
});
