import { FindByUsernameUser } from '../usecases/find-by-username-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';

export class FindByUsernameUserFactory {
  static async run(username: string) {
    return await FindByUsernameUser.execute(username, new UserPrismaDB());
  }
}
