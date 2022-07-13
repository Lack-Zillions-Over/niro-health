import { Locale } from '@/core/libs/i18n.lib';

import { CreatePrivateKey } from '@/core/usecases/create-private-keys.usecase';
import { ValidatePrivateKey } from '@/core/usecases/validate-private-keys.usecase';
import { PrivateKeyMemoryDB } from '@/core/db/private-keys-memory.db';
import { PrivateKey } from '@/core/entities/private-keys.entity';

const locale = new Locale();
const privateKeys: PrivateKey[] = [];

describe(
  locale.translate('tests.private-keys.usecases.validate.describe'),
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
        'tests.private-keys.usecases.validate.validate_valid_key',
      ) as string,
      async () => {
        const { tag, value } = privateKeys[0];

        const key = await ValidatePrivateKey.execute(
          tag,
          '123456',
          value,
          new PrivateKeyMemoryDB(privateKeys),
          locale,
        );

        expect(key instanceof Error).not.toBe(true);

        if (!(key instanceof Error)) expect(key).toBe(true);
      },
    );

    it(
      locale.translate(
        'tests.private-keys.usecases.validate.not_validate_key_with_invalid_tag',
      ) as string,
      async () => {
        await expect(
          ValidatePrivateKey.execute(
            '???',
            '???',
            '???',
            new PrivateKeyMemoryDB(privateKeys),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate(
            'private-keys.repository.private_key_not_found',
            'tag',
            '???',
          ) as string,
        );
      },
    );

    it(
      locale.translate(
        'tests.private-keys.usecases.validate.not_validate_key_with_invalid_secret',
      ) as string,
      async () => {
        await expect(
          ValidatePrivateKey.execute(
            privateKeys[0].tag,
            '???',
            '???',
            new PrivateKeyMemoryDB(privateKeys),
            locale,
          ),
        ).resolves.toThrowError(
          locale.translate('private-keys.repository.invalid_secret') as string,
        );
      },
    );
  },
);
