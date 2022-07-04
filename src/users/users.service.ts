import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

import { CreateUserFactory } from './factories/create-users.factory';
import { FindAllUsersFactory } from './factories/find-all-users.factory';
import { FindByIdUserFactory } from './factories/find-by-id-users.factory';
import { FindByUsernameUserFactory } from './factories/find-by-username-users.factory';
import { AuthUserFactory } from './factories/auth-users.factory';
import { GenerateAndAssignTokenRevalidateUserFactory } from './factories/generate-and-assign-token-revalidate-users.factory';
import { ValidateTokenRevalidateUserFactory } from './factories/validate-token-revalidate-users.factory';
import { UpdateUserFactory } from './factories/update-users.factory';
import { RemoveUserFactory } from './factories/remove-users.factory';
import { JWTRevalidate } from './types/session.type';

@Injectable()
export class UsersService {
  async create(user: CreateUserDto) {
    return await CreateUserFactory.run(user);
  }

  async findAll() {
    return await FindAllUsersFactory.run();
  }

  async findOne(id: string) {
    return await FindByIdUserFactory.run(id);
  }

  async findByUsername(username: string) {
    return await FindByUsernameUserFactory.run(username);
  }

  async auth(username: string, password: string) {
    return await AuthUserFactory.run(username, password);
  }

  async generateAndAssignTokenRevalidate(id: string) {
    return await GenerateAndAssignTokenRevalidateUserFactory.run(id);
  }

  async validateTokenRevalidate(token: JWTRevalidate) {
    return await ValidateTokenRevalidateUserFactory.run(token);
  }

  async update(id: string, newData: UpdateUserDto) {
    return await UpdateUserFactory.run(id, newData);
  }

  async remove(id: string) {
    return await RemoveUserFactory.run(id);
  }
}
