import { AuthUser } from '../usecases/auth-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';

export class AuthUserFactory {
  static async run(username: string, password: string) {
    return await AuthUser.execute(username, password, new UserPrismaDB());
  }
}
