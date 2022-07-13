import { Locale } from '@/core/libs/i18n.lib';

import { CreatePrivateKey } from '@/core/usecases/create-private-keys.usecase';
import { PrivateKeyMemoryDB } from '@/core/db/private-keys-memory.db';
import { PrivateKey } from '@/core/entities/private-keys.entity';

const locale = new Locale();
const privateKeys: PrivateKey[] = [];

describe(
  locale.translate('tests.private-keys.usecases.create.describe'),
  () => {
    it(
      locale.translate(
        'tests.private-keys.usecases.create.create_new_key',
      ) as string,
      async () => {
        const key = await CreatePrivateKey.execute(
          {
            tag: 'test',
            secret: '123456',
          },
          new PrivateKeyMemoryDB(privateKeys),
          locale,
        );

        expect(key instanceof Error).not.toBe(true);

        if (!(key instanceof Error)) {
          expect(key.id).toBeDefined();
          expect(key.value).toBeDefined();
          expect(key.secret).not.toBe('123456'); // This is encrypted
        }
      },
    );

    it(
      locale.translate(
        'tests.private-keys.usecases.create.create_new_key_same_tag',
      ) as string,
      async () => {
        await expect(
          CreatePrivateKey.execute(
            {
              tag: 'test',
              secret: '123456',
            },
            new PrivateKeyMemoryDB(privateKeys),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'private-keys.repository.private_key_already_exists',
            'tag',
            'test',
          ) as string,
        );
      },
    );
  },
);
