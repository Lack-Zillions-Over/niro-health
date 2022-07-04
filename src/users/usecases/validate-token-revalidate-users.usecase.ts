import { UserRepository } from '../repositories/users.repository';
import { UserDatabaseContract } from '../contracts/users-database.contract';
import { JWTRevalidate } from '../types/session.type';

export class ValidateTokenRevalidateUser {
  static async execute(token: JWTRevalidate, database: UserDatabaseContract) {
    const repository = new UserRepository(database);

    return await repository.validateTokenRevalidate(token);
  }
}
