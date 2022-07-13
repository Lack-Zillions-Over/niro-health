import { Locale } from '@/core/libs/i18n.lib';

import { CreatePrivateKey } from '@/core/usecases/create-private-keys.usecase';
import { FindAllPrivateKeys } from '@/core/usecases/find-all-private-keys.usecase';
import { PrivateKeyMemoryDB } from '@/core/db/private-keys-memory.db';
import { PrivateKey } from '@/core/entities/private-keys.entity';

const locale = new Locale();
const privateKeys: PrivateKey[] = [];

describe(
  locale.translate('tests.private-keys.usecases.find.all.describe'),
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
        'tests.private-keys.usecases.find.all.find_all_keys',
      ) as string,
      async () => {
        const keys = await FindAllPrivateKeys.execute(
          new PrivateKeyMemoryDB(privateKeys),
          locale,
        );

        expect(keys.length).toBeGreaterThan(0);
      },
    );
  },
);
