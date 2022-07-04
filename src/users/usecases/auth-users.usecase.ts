import { UserRepository } from '../repositories/users.repository';
import { UserDatabaseContract } from '../contracts/users-database.contract';

export class AuthUser {
  static async execute(
    username: string,
    password: string,
    database: UserDatabaseContract,
  ) {
    const repository = new UserRepository(database);

    return await repository.auth(username, password);
  }
}
