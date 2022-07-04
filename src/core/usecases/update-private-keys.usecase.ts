import { PrivateKeyRepository } from '../repositories/private-keys.repository';
import { PrivateKeyDatabaseContract } from '../contracts/private-keys-database.contract';
import { UpdatePrivateKeyDto } from '../dto/update-private-keys.dto';

export class UpdatePrivateKey {
  static async execute(
    id: string,
    newData: UpdatePrivateKeyDto,
    database: PrivateKeyDatabaseContract,
  ) {
    const repository = new PrivateKeyRepository(database),
      key = await repository.findById(id);

    if (key instanceof Error) return new Error(`Key with id "${id}" not found`);

    return await repository.update(id, { ...key, ...newData });
  }
}
