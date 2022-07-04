import { PrivateKeyRepository } from '../repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';

export class FindByTagPrivateKey {
  static async execute(tag: string, database: PrivateKeyDatabaseContract) {
    const repository = new PrivateKeyRepository(database);

    return await repository.findByTag(tag);
  }
}
