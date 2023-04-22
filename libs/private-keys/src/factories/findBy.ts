import type { INestApplication } from '@nestjs/common';
import type { PrivateKey } from '@app/private-keys/entities';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import { FindByPrivateKey } from '@app/private-keys/usecases/findBy';
import { PrivateKeyPrismaDB } from '@app/private-keys/db/prisma';

export class FindByPrivateKeyFactory {
  static async run(
    filter: RecursivePartial<PrivateKey>,
    similarity: Type,
    app: INestApplication,
  ) {
    const database = new PrivateKeyPrismaDB(app);
    return await FindByPrivateKey.execute(filter, similarity, database, app);
  }
}
