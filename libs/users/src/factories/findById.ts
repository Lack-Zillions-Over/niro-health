import type { INestApplication } from '@nestjs/common';
import { FindByIdUser } from '@app/users/usecases/findById';
import { UserPrismaDB } from '@app/users/db/prisma';

export class FindByIdUserFactory {
  static async run(id: string, app: INestApplication) {
    const database = new UserPrismaDB(app);
    return await FindByIdUser.execute(id, database, app);
  }
}
