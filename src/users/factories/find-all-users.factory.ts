import { FindAllUsers } from '../usecases/find-all-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';

export class FindAllUsersFactory {
  static async run() {
    return await FindAllUsers.execute(new UserPrismaDB());
  }
}
