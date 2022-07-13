import { PrivateKeyRepository } from '@/core/repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '@/core/contracts/private-keys-database.contract';
import { UpdatePrivateKeyDto } from '@/core/dto/update-private-keys.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class UpdatePrivateKey {
  static async execute(
    id: string,
    newData: UpdatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
    locale: Locale,
  ) {
    const repository = new PrivateKeyRepository(database, locale),
      key = await repository.findById(id);

    if (key instanceof Error)
      return new Error(
        locale.translate(
          'private-keys.repository.private_key_not_found',
          'id',
          id,
        ) as string,
      );

    return await repository.update(id, { ...key, ...newData });
  }
}
