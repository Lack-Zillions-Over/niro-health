import type { INestApplication } from '@nestjs/common';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';
import { User } from '@app/users/entities';

export class FindByUser {
  static async execute(
    filter: RecursivePartial<User>,
    similarity: Type,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);
    return await repository.findBy(filter, similarity);
  }
}
