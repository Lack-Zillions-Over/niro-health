import type { INestApplication } from '@nestjs/common';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';

export class LogoutUser {
  static async execute(
    id: string,
    token_value: string,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);

    return await repository.logout(id, token_value);
  }
}
