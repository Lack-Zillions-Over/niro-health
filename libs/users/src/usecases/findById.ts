import type { INestApplication } from '@nestjs/common';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';

export class FindByIdUser {
  static async execute(
    id: string,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);
    return await repository.findById(id);
  }
}
