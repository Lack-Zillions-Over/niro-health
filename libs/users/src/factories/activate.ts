import type { INestApplication } from '@nestjs/common';
import { ActivateUser } from '@app/users/usecases/activate';
import { UserPrismaDB } from '@app/users/db/prisma';

export class ActivateUserFactory {
  static async run(id: string, app: INestApplication) {
    const database = new UserPrismaDB(app);
    return await ActivateUser.execute(id, database, app);
  }
}
