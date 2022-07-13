import { FindAllPrivateKeys } from '@/core/usecases/find-all-private-keys.usecase';
import { PrivateKeyPrismaDB } from '@/core/db/private-keys-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class FindAllPrivateKeysFactory {
  static async run(locale: Locale) {
    return await FindAllPrivateKeys.execute(new PrivateKeyPrismaDB(), locale);
  }
}
