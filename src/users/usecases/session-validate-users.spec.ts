import { Locale } from '@/core/libs/i18n.lib';

import { CreateUser } from '@/users/usecases/create-users.usecase';
import { LoginUser } from '@/users/usecases/login-users.usecase';
import { SessionValidateUser } from '@/users/usecases/session-validate-users.usecase';
import { UserMemoryDB } from '@/users/db/users-memory.db';
import { User } from '@/users/entities/users.entity';

import { ValidateDateISO } from '@/core/validators/date-iso.validator';

const locale = new Locale();
const users: User[] = [];

let token_value,
  token_signature,
  token_revalidate_value,
  token_revalidate_signature;

describe(
  locale.translate('tests.users.usecases.session-validate.describe'),
  () => {
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
            Object.values(session.accessTokenRevalidate).filter(
              (value) => !value,
            ).length <= 0,
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

          token_value = session.accessTokens[0].value;
          token_signature = session.accessTokens[0].signature;
          token_revalidate_value = session.accessTokenRevalidate.value;
          token_revalidate_signature = session.accessTokenRevalidate.signature;
        }
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.session-validate.validate_valid_session',
      ) as string,
      async () => {
        const session = await SessionValidateUser.execute(
          'GuilhermeSantos001',
          token_value,
          token_signature,
          token_revalidate_value,
          token_revalidate_signature,
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

        expect(session instanceof Error).not.toBe(true);
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_invalid_username',
      ) as string,
      async () => {
        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos002',
            token_value,
            token_signature,
            token_revalidate_value,
            token_revalidate_signature,
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
        'tests.users.usecases.session-validate.not_validate_session_with_invalid_token_value',
      ) as string,
      async () => {
        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            '???',
            token_signature,
            token_revalidate_value,
            token_revalidate_signature,
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

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_invalid_token_signature',
      ) as string,
      async () => {
        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            token_value,
            '???',
            token_revalidate_value,
            token_revalidate_signature,
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

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_invalid_token_revalidate_value',
      ) as string,
      async () => {
        const _users = JSON.parse(JSON.stringify(users));

        _users[0].session.accessTokens[0].expireIn = new Date(
          '2019-01-01',
        ).toString();

        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            token_value,
            token_signature,
            '???',
            token_revalidate_signature,
            'Desktop',
            {
              ipAddress: '192.168.0.1',
              city: 'São Paulo',
              country: 'Brazil',
              region: 'BR/SP',
              timezone: 'America/Sao_Paulo',
            },
            new UserMemoryDB(_users),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'users.repository.session_token_revalidate_is_invalid',
          ) as string,
        );
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_invalid_token_revalidate_signature',
      ) as string,
      async () => {
        const _users = JSON.parse(JSON.stringify(users));

        _users[0].session.accessTokens[0].expireIn = new Date(
          '2019-01-01',
        ).toString();

        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            token_value,
            token_signature,
            token_revalidate_value,
            '???',
            'Desktop',
            {
              ipAddress: '192.168.0.1',
              city: 'São Paulo',
              country: 'Brazil',
              region: 'BR/SP',
              timezone: 'America/Sao_Paulo',
            },
            new UserMemoryDB(_users),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'users.repository.session_token_revalidate_is_invalid',
          ) as string,
        );
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_geoip_not_same_stored',
      ) as string,
      async () => {
        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            token_value,
            token_signature,
            token_revalidate_value,
            token_revalidate_signature,
            'Desktop',
            {
              ipAddress: '192.168.0.2',
              city: 'São Paulo',
              country: 'Brazil',
              region: 'BR/SP',
              timezone: 'America/Sao_Paulo',
            },
            new UserMemoryDB(users),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'users.repository.session_geoip_not_equal_stored',
          ) as string,
        );
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_device_not_same_stored',
      ) as string,
      async () => {
        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            token_value,
            token_signature,
            token_revalidate_value,
            token_revalidate_signature,
            'Mobile',
            {
              ipAddress: '192.168.0.1',
              city: 'São Paulo',
              country: 'Brazil',
              region: 'BR/SP',
              timezone: 'America/Sao_Paulo',
            },
            new UserMemoryDB(users),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'users.repository.session_device_is_not_same_in_history',
            'Mobile',
          ) as string,
        );
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_token_revalidate_ipAddress_not_same_stored',
      ) as string,
      async () => {
        const _users = JSON.parse(JSON.stringify(users));

        _users[0].session.accessTokens[0].expireIn = new Date(
          '2019-01-01',
        ).toString();
        _users[0].session.accessTokenRevalidate.ipAddress = '192.168.0.2';

        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            token_value,
            token_signature,
            token_revalidate_value,
            token_revalidate_signature,
            'Desktop',
            {
              ipAddress: '192.168.0.1',
              city: 'São Paulo',
              country: 'Brazil',
              region: 'BR/SP',
              timezone: 'America/Sao_Paulo',
            },
            new UserMemoryDB(_users),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'users.repository.session_token_revalidate_ipAddress_is_not_stored',
            '192.168.0.1',
          ) as string,
        );
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.session-validate.not_validate_session_with_expired_token_revalidate',
      ) as string,
      async () => {
        const _users = JSON.parse(JSON.stringify(users));

        _users[0].session.accessTokens[0].expireIn = new Date(
          '2019-01-01',
        ).toString();
        _users[0].session.accessTokenRevalidate.expireIn = new Date(
          '2019-01-01',
        ).toString();

        await expect(
          SessionValidateUser.execute(
            'GuilhermeSantos001',
            token_value,
            token_signature,
            token_revalidate_value,
            token_revalidate_signature,
            'Desktop',
            {
              ipAddress: '192.168.0.1',
              city: 'São Paulo',
              country: 'Brazil',
              region: 'BR/SP',
              timezone: 'America/Sao_Paulo',
            },
            new UserMemoryDB(_users),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'users.repository.session_access_token_expired',
          ) as string,
        );
      },
    );
  },
);
