import type { INestApplication } from '@nestjs/common';
import { DeleteUser } from '@app/users/usecases/delete';
import { UserPrismaDB } from '@app/users/db/prisma';

export class DeleteUserFactory {
  static async run(id: string, app: INestApplication) {
    const database = new UserPrismaDB(app);
    return await DeleteUser.execute(id, database, app);
  }
}
