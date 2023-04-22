import type { INestApplication } from '@nestjs/common';
import type { CreateUserDto } from '@app/users/dto/create';
import { CreateUser } from '@app/users/usecases/create';
import { UserPrismaDB } from '@app/users/db/prisma';

export class CreateUserFactory {
  static async run(user: CreateUserDto, app: INestApplication) {
    const database = new UserPrismaDB(app);
    return await CreateUser.execute(user, database, app);
  }
}
