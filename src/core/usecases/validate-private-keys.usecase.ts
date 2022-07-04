import { PrivateKeyRepository } from '../repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';

export class ValidatePrivateKey {
  static async execute(
    tag: string,
    secret: string,
    value: string,
    database: PrivateKeyDatabaseContract,
  ) {
    const repository = new PrivateKeyRepository(database);

    return await repository.validate(tag, secret, value);
  }
}
