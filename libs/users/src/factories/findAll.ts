import type { INestApplication } from '@nestjs/common';
import { FindAllUsers } from '@app/users/usecases/findAll';
import { UserPrismaDB } from '@app/users/db/prisma';

export class FindAllUsersFactory {
  static async run(
    query: {
      limit?: number;
      skip?: number;
    },
    app: INestApplication,
  ) {
    const database = new UserPrismaDB(app);
    return await FindAllUsers.execute(query, database, app);
  }
}
