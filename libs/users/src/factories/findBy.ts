import type { INestApplication } from '@nestjs/common';
import type { User } from '@app/users/entities';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import { FindByUser } from '@app/users/usecases/findBy';
import { UserPrismaDB } from '@app/users/db/prisma';

export class FindByUserFactory {
  static async run(
    filter: RecursivePartial<User>,
    similarity: Type,
    app: INestApplication,
  ) {
    const database = new UserPrismaDB(app);
    return await FindByUser.execute(filter, similarity, database, app);
  }
}
