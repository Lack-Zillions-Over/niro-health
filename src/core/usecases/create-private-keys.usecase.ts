import { PrivateKeyRepository } from '@/core/repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '@/core/contracts/private-keys-database.contract';
import { CreatePrivateKeyDto } from '@/core/dto/create-private-keys.dto';
import { Locale } from '@/core/libs/i18n.lib';

export class CreatePrivateKey {
  static async execute(
    key: CreatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
    locale: Locale,
  ) {
    const repository = new PrivateKeyRepository(database, locale);

    return await repository.register({
      ...key,
      id: database.generateID(),
      value: database.generateValue(),
    });
  }
}
