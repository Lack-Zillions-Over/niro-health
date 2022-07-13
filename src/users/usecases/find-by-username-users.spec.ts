import { Locale } from '@/core/libs/i18n.lib';

import { CreateUser } from '@/users/usecases/create-users.usecase';
import { FindByUsernameUser } from '@/users/usecases/find-by-username-users.usecase';
import { UserMemoryDB } from '@/users/db/users-memory.db';
import { User } from '@/users/entities/users.entity';

const locale = new Locale();
const users: User[] = [];

describe(
  locale.translate('tests.users.usecases.find.username.describe'),
  () => {
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
        'tests.users.usecases.find.username.find_username_valid',
      ) as string,
      async () => {
        const user = await FindByUsernameUser.execute(
          'GuilhermeSantos001',
          new UserMemoryDB(users),
          locale,
        );

        expect(user instanceof Error).not.toBe(true);

        if (!(user instanceof Error)) {
          expect(user.id).toBeDefined();
        }
      },
    );

    it(
      locale.translate(
        'tests.users.usecases.find.username.not_find_username_invalid',
      ) as string,
      async () => {
        await expect(
          FindByUsernameUser.execute('???', new UserMemoryDB(users), locale),
        ).resolves.toThrowError(
          locale.translate(
            'users.repository.user_not_exists',
            'username',
            '???',
          ) as string,
        );
      },
    );
  },
);
