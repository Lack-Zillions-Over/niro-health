import { RemovePrivateKey } from '@/core/usecases/remove-private-keys.usecase';
import { PrivateKeyPrismaDB } from '@/core/db/private-keys-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class RemovePrivateKeyFactory {
  static async run(id: string, locale: Locale) {
    return await RemovePrivateKey.execute(id, new PrivateKeyPrismaDB(), locale);
  }
}
