import { Locale } from '@/core/libs/i18n.lib';

import { CreateUser } from '@/users/usecases/create-users.usecase';
import { UpdateUser } from '@/users/usecases/update-users.usecase';
import { UserMemoryDB } from '@/users/db/users-memory.db';
import { User } from '@/users/entities/users.entity';

const locale = new Locale();
const users: User[] = [];

describe(locale.translate('tests.users.usecases.update.describe'), () => {
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
      'tests.users.usecases.create.create_multiple_users',
    ) as string,
    async () => {
      let i = 0;

      for (; i < 10; i++) {
        await CreateUser.execute(
          {
            username: `user-${i}`,
            email: `user-${i}@testing.com`,
            password: '123456',
          },
          new UserMemoryDB(users),
          locale,
        );
      }

      expect(users.length).toBeGreaterThan(10);
    },
  );

  it(
    locale.translate('tests.users.usecases.update.update_valid_user') as string,
    async () => {
      const id = users[0].id;

      const user = await UpdateUser.execute(
        id,
        {
          username: 'GuilhermeSantos002',
        },
        new UserMemoryDB(users),
        locale,
      );

      expect(user instanceof Error).not.toBe(true);

      if (!(user instanceof Error)) {
        expect(user.username).not.toBe('GuilhermeSantos001');
      }
    },
  );

  it(
    locale.translate(
      'tests.users.usecases.update.not_update_without_user',
    ) as string,
    async () => {
      await expect(
        UpdateUser.execute(
          '???',
          {
            username: 'GuilhermeSantos002',
          },
          new UserMemoryDB(users),
          locale,
        ),
      ).resolves.toThrowError(
        locale.translate(
          'users.repository.user_not_exists',
          'id',
          '???',
        ) as string,
      );
    },
  );

  it(
    locale.translate(
      'tests.users.usecases.update.not_update_user_with_same_username',
    ) as string,
    async () => {
      const id = users[0].id;

      await expect(
        UpdateUser.execute(
          id,
          {
            username: 'user-1',
          },
          new UserMemoryDB(users),
          locale,
        ),
      ).resolves.toThrowError(
        locale.translate(
          'users.repository.field_in_use',
          'username',
          'user-1',
        ) as string,
      );
    },
  );
});
