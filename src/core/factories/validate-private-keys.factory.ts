import { ValidatePrivateKey } from '@/core/usecases/validate-private-keys.usecase';
import { PrivateKeyPrismaDB } from '@/core/db/private-keys-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class ValidatePrivateKeyFactory {
  static async run(tag: string, secret: string, value: string, locale: Locale) {
    return await ValidatePrivateKey.execute(
      tag,
      secret,
      value,
      new PrivateKeyPrismaDB(),
      locale,
    );
  }
}
