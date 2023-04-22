import type { INestApplication } from '@nestjs/common';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import { PrivateKeyRepository } from '@app/private-keys/repositories';
import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';
import { PrivateKey } from '@app/private-keys/entities';

export class FindByPrivateKey {
  static async execute(
    filter: RecursivePartial<PrivateKey>,
    similarity: Type,
    database: PrivateKeyDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new PrivateKeyRepository(database, app);

    return await repository.findBy(filter, similarity);
  }
}
