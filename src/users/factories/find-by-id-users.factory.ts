import { FindByIdUser } from '../usecases/find-by-id-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';

export class FindByIdUserFactory {
  static async run(id: string) {
    return await FindByIdUser.execute(id, new UserPrismaDB());
  }
}
