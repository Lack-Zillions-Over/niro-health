import { CreatePrivateKey } from '@/core/usecases/create-private-keys.usecase';
import { PrivateKeyPrismaDB } from '@/core/db/private-keys-prisma.db';
import { CreatePrivateKeyDto } from '@/core/dto/create-private-keys.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class CreatePrivateKeyFactory {
  static async run(key: CreatePrivateKeyDto, locale: Locale) {
    return await CreatePrivateKey.execute(
      key,
      new PrivateKeyPrismaDB(),
      locale,
    );
  }
}
