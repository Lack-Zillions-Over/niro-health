import { CreateUser } from '../usecases/create-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';
import { CreateUserDto } from '../dto/create-users.dto';

export class CreateUserFactory {
  static async run(user: CreateUserDto) {
    return await CreateUser.execute(user, new UserPrismaDB());
  }
}
