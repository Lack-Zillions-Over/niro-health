import { PrivateKeyRepository } from '@/core/repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '@/core/contracts/private-keys-database.contract';
import { Locale } from '@/core/libs/i18n.lib';

export class FindAllPrivateKeys {
  static async execute(database: PrivateKeyDatabaseContract, locale: Locale) {
    const repository = new PrivateKeyRepository(database, locale);

    return await repository.findMany();
  }
}
