import type { INestApplication } from '@nestjs/common';
import { LogoutUser } from '@app/users/usecases/logout';
import { UserPrismaDB } from '@app/users/db/prisma';

export class LogoutUserFactory {
  static async run(id: string, token_value: string, app: INestApplication) {
    const database = new UserPrismaDB(app);
    return await LogoutUser.execute(id, token_value, database, app);
  }
}
