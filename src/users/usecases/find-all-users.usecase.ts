import { UserRepository } from '../repositories/users.repository';
import { UserDatabaseContract } from '../contracts/users-database.contract';

export class FindAllUsers {
  static async execute(database: UserDatabaseContract) {
    const repository = new UserRepository(database);

    return await repository.findMany();
  }
}
