import { UpdatePrivateKey } from '@/core/usecases/update-private-keys.usecase';
import { PrivateKeyPrismaDB } from '@/core/db/private-keys-prisma.db';
import { UpdatePrivateKeyDto } from '@/core/dto/update-private-keys.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class UpdatePrivateKeyFactory {
  static async run(id: string, newData: UpdatePrivateKeyDto, locale: Locale) {
    return await UpdatePrivateKey.execute(
      id,
      newData,
      new PrivateKeyPrismaDB(),
      locale,
    );
  }
}
