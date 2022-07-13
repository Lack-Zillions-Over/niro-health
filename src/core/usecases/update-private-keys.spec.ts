import { Locale } from '@/core/libs/i18n.lib';

import { CreatePrivateKey } from '@/core/usecases/create-private-keys.usecase';
import { UpdatePrivateKey } from '@/core/usecases/update-private-keys.usecase';
import { PrivateKeyMemoryDB } from '@/core/db/private-keys-memory.db';
import { PrivateKey } from '@/core/entities/private-keys.entity';

const locale = new Locale();
const privateKeys: PrivateKey[] = [];

describe(
  locale.translate('tests.private-keys.usecases.update.describe'),
  () => {
    it(
      locale.translate(
        'tests.private-keys.usecases.create.create_new_key',
      ) as string,
      async () => {
        let i = 0;

        for (; i < 2; i++) {
          const key = await CreatePrivateKey.execute(
            {
              tag: `testing-${i}`,
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
        }
      },
    );

    it(
      locale.translate(
        'tests.private-keys.usecases.update.update_valid_key',
      ) as string,
      async () => {
        const key = await UpdatePrivateKey.execute(
          privateKeys[0].id,
          {
            tag: 'new-tag',
          },
          new PrivateKeyMemoryDB(privateKeys),
          locale,
        );

        expect(key instanceof Error).not.toBe(true);

        if (!(key instanceof Error)) expect(key.tag).toBe('new-tag');
      },
    );

    it(
      locale.translate(
        'tests.private-keys.usecases.update.not_update_key_without_register',
      ) as string,
      async () => {
        await expect(
          UpdatePrivateKey.execute(
            '???',
            {
              tag: 'testing-1',
            },
            new PrivateKeyMemoryDB(privateKeys),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'private-keys.repository.private_key_not_found',
            'id',
            '???',
          ) as string,
        );
      },
    );

    it(
      locale.translate(
        'tests.private-keys.usecases.update.not_update_key_with_same_tag',
      ) as string,
      async () => {
        await expect(
          UpdatePrivateKey.execute(
            privateKeys[0].id,
            {
              tag: 'testing-1',
            },
            new PrivateKeyMemoryDB(privateKeys),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'private-keys.repository.field_in_use',
            'Tag',
            'testing-1',
          ) as string,
        );
      },
    );
  },
);
