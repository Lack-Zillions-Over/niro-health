import { PrivateKeyRepository } from '../repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';
import { CreatePrivateKeyDto } from '../dto/create-private-keys.dto';

export class CreatePrivateKey {
  static async execute(
    key: CreatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
  ) {
    const repository = new PrivateKeyRepository(database);

    return await repository.register({
      ...key,
      id: database.generateID(),
      value: database.generateValue(),
    });
  }
}
