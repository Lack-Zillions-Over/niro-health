import { UpdateUser } from '../usecases/update-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';
import { UpdateUserDto } from '../dto/update-users.dto';

export class UpdateUserFactory {
  static async run(id: string, newData: UpdateUserDto) {
    return await UpdateUser.execute(id, newData, new UserPrismaDB());
  }
}
