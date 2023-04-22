import type { INestApplication } from '@nestjs/common';
import type { UpdateUserDto } from '@app/users/dto/update';
import { UpdateUser } from '@app/users/usecases/update';
import { UserPrismaDB } from '@app/users/db/prisma';

export class UpdateUserFactory {
  static async run(id: string, newData: UpdateUserDto, app: INestApplication) {
    const database = new UserPrismaDB(app);
    return await UpdateUser.execute(id, newData, database, app);
  }
}
