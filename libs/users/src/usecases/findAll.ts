import type { INestApplication } from '@nestjs/common';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';

export class FindAllUsers {
  static async execute(
    query: {
      limit?: number;
      skip?: number;
    },
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);
    return await repository.findAll(query.limit, query.skip);
  }
}
