import type { INestApplication } from '@nestjs/common';
import type { CreateUserDto } from '@app/users/dto/create';
import { UserRepository } from '@app/users/repositories';
import { UserDatabaseContract } from '@app/users/contracts';
import { User } from '@app/users/entities';

export class CreateUser {
  static async execute(
    user: CreateUserDto,
    database: UserDatabaseContract,
    app: INestApplication,
  ) {
    const repository = new UserRepository(database, app);
    const entity = new User({ id: database.generateUUID() });

    entity.username = user.username;
    entity.email = user.email;
    entity.password = user.password;
    entity.roles = ['common'];
    entity.hash = {
      email: database.hashText(user.email),
    };
    entity.activate = false;

    return await repository.create(entity);
  }
}
