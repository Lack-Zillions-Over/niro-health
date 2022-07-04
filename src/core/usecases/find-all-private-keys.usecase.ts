import { PrivateKeyRepository } from '../repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';

export class FindAllPrivateKeys {
  static async execute(database: PrivateKeyDatabaseContract) {
    const repository = new PrivateKeyRepository(database);

    return await repository.findMany();
  }
}
