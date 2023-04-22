import type { INestApplication } from '@nestjs/common';
import { PrivateKeyRepository } from '@app/private-keys/repositories';
import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';

export class DeletePrivateKey {
  static async execute(
    id: string,
    database: PrivateKeyDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new PrivateKeyRepository(database, app);

    return await repository.delete(id);
  }
}
