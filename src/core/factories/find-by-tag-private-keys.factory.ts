import { FindByTagPrivateKey } from '@/core/usecases/find-by-tag-private-keys.usecase';
import { PrivateKeyPrismaDB } from '@/core/db/private-keys-prisma.db';
import { Locale } from '@/core/libs/i18n.lib';

export class FindByTagPrivateKeyFactory {
  static async run(tag: string, locale: Locale) {
    return await FindByTagPrivateKey.execute(
      tag,
      new PrivateKeyPrismaDB(),
      locale,
    );
  }
}
