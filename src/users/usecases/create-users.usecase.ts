import { UserRepository } from '../repositories/users.repository';
import { UserDatabaseContract } from '../contracts/users-database.contract';
import { CreateUserDto } from '../dto/create-users.dto';

export class CreateUser {
  static async execute(user: CreateUserDto, database: UserDatabaseContract) {
    const repository = new UserRepository(database);

    return await repository.register({
      ...user,
      id: database.generateID(),
      hash: {
        email: database.hashByText(user.email),
      },
    });
  }
}
