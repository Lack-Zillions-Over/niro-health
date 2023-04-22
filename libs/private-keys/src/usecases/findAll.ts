import type { INestApplication } from '@nestjs/common';
import { PrivateKeyRepository } from '@app/private-keys/repositories';
import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';

export class FindAllPrivateKeys {
  static async execute(
    query: {
      limit?: number;
      offset?: number;
    },
    database: PrivateKeyDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new PrivateKeyRepository(database, app);

    return await repository.findAll(query.limit, query.offset);
  }
}
