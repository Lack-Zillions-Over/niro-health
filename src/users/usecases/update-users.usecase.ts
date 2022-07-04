import { UserRepository } from '../repositories/users.repository';
import { UserDatabaseContract } from '../contracts/users-database.contract';
import { UpdateUserDto } from '../dto/update-users.dto';

export class UpdateUser {
  static async execute(
    id: string,
    newData: UpdateUserDto,
    database: UserDatabaseContract,
  ) {
    const repository = new UserRepository(database),
      user = await repository.findById(id);

    if (user instanceof Error)
      return new Error(`User with id "${id}" not found`);

    return await repository.update(id, { ...user, ...newData });
  }
}
