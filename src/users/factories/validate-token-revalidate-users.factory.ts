import { ValidateTokenRevalidateUser } from '../usecases/validate-token-revalidate-users.usecase';
import { UserPrismaDB } from '../db/users-prisma.db';
import { JWTRevalidate } from '../types/session.type';

export class ValidateTokenRevalidateUserFactory {
  static async run(token: JWTRevalidate) {
    return await ValidateTokenRevalidateUser.execute(token, new UserPrismaDB());
  }
}
