import { PrivateKeyRepository } from '../repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';

export class RemovePrivateKey {
  static async execute(id: string, database: PrivateKeyDatabaseContract) {
    const repository = new PrivateKeyRepository(database);

    return await repository.remove(id);
  }
}
