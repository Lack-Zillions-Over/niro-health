import { Locale } from '@/core/libs/i18n.lib';

import { CreateUser } from '@/users/usecases/create-users.usecase';
import { UserMemoryDB } from '@/users/db/users-memory.db';
import { User } from '@/users/entities/users.entity';

const locale = new Locale();
const users: User[] = [];

describe(locale.translate('tests.users.usecases.login.describe'), () => {
  it(
    locale.translate('tests.users.usecases.create.create_new_user') as string,
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
      'tests.users.usecases.create.not_create_user_with_same_username',
    ) as string,
    async () => {
      await expect(
        CreateUser.execute(
          {
            username: 'GuilhermeSantos001',
            email: 'testing@testing.com',
            password: '123456',
          },
          new UserMemoryDB(users),
          locale,
        ),
      ).resolves.toThrowError(
        locale.translate(
          'users.repository.user_already_exists',
          'username',
          'GuilhermeSantos001',
        ) as string,
      );
    },
  );

  it(
    locale.translate(
      'tests.users.usecases.create.not_create_user_with_same_email',
    ) as string,
    async () => {
      await expect(
        CreateUser.execute(
          {
            username: 'GuilhermeSantos002',
            email: 'testing@testing.com',
            password: '123456',
          },
          new UserMemoryDB(users),
          locale,
        ),
      ).resolves.toThrowError(
        locale.translate(
          'users.repository.user_already_exists',
          'email',
          'testing@testing.com',
        ) as string,
      );
    },
  );
});
