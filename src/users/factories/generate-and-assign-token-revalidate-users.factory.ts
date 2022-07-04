import { GenerateAndAssignTokenRevalidateUser } from '../usecases/generate-and-assign-token-revalidate-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';

export class GenerateAndAssignTokenRevalidateUserFactory {
  static async run(id: string) {
    return await GenerateAndAssignTokenRevalidateUser.execute(
      id,
      new UserPrismaDB(),
    );
  }
}
