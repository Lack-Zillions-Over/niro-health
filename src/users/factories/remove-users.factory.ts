import { RemoveUser } from '../usecases/remove-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';

export class RemoveUserFactory {
  static async run(id: string) {
    return await RemoveUser.execute(id, new UserPrismaDB());
  }
}
