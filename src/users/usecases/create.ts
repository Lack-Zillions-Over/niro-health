import { UserRepository } from '@/users/repositories';
import { UserDatabaseContract } from '@/users/contracts';
import { CreateUserDto } from '@/users/dto/create';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class CreateUser {
  static async execute(
    user: CreateUserDto,
    database: UserDatabaseContract,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const repository = new UserRepository(database, libsService, utilsService);

    return await repository.register({
      ...user,
      id: database.generateID(),
      roles: ['common'],
      hash: {
        email: database.hashByText(user.email),
      },
      activate: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
