import { UserRepository } from '../repositories/users.repository';
import { UserDatabaseContract } from '../contracts/users-database.contract';

export class GenerateAndAssignTokenRevalidateUser {
  static async execute(id: string, database: UserDatabaseContract) {
    const repository = new UserRepository(database);

    return await repository.generateAndAssignTokenRevalidate(id);
  }
}
