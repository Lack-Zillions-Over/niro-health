import { Inject, Injectable } from '@nestjs/common';

import { User } from '@app/users/entities';
import type { IAppHostService } from '@app/app-host';

import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';
import type { GeoIP } from '@app/core/types/geo-ip.type';

import type { CreateUserDto } from '@app/users/dto/create';
import type { UpdateUserDto } from '@app/users/dto/update';

import { CreateUserFactory } from '@app/users/factories/create';
import { ActivateUserFactory } from '@app/users/factories/activate';
import { LoginUserFactory } from '@app/users/factories/login';
import { SessionValidateUserFactory } from '@app/users/factories/sessionValidate';
import { LogoutUserFactory } from '@app/users/factories/logout';
import { FindAllUsersFactory } from '@app/users/factories/findAll';
import { FindByIdUserFactory } from '@app/users/factories/findById';
import { FindByUserFactory } from '@app/users/factories/findBy';
import { UpdateUserFactory } from '@app/users/factories/update';
import { DeleteUserFactory } from '@app/users/factories/delete';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IAppHostService')
    private readonly appHostService: IAppHostService,
  ) {}

  async create(user: CreateUserDto) {
    return await CreateUserFactory.run(user, this.appHostService.app);
  }

  async activate(id: string) {
    return await ActivateUserFactory.run(id, this.appHostService.app);
  }

  async login(
    email: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
  ) {
    return await LoginUserFactory.run(
      email,
      password,
      device_name,
      geo_ip,
      this.appHostService.app,
    );
  }

  async sessionValidate(
    id: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
  ) {
    return await SessionValidateUserFactory.run(
      id,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
      this.appHostService.app,
    );
  }

  async logout(id: string, token_value: string) {
    return await LogoutUserFactory.run(
      id,
      token_value,
      this.appHostService.app,
    );
  }

  async findAll(limit?: number, skip?: number) {
    return await FindAllUsersFactory.run(
      {
        limit,
        skip,
      },
      this.appHostService.app,
    );
  }

  async findOne(id: string) {
    return await FindByIdUserFactory.run(id, this.appHostService.app);
  }

  async findBy(filter: RecursivePartial<User>, similarity: Type) {
    return await FindByUserFactory.run(
      filter,
      similarity,
      this.appHostService.app,
    );
  }

  async update(id: string, newData: UpdateUserDto) {
    return await UpdateUserFactory.run(id, newData, this.appHostService.app);
  }

  async delete(id: string) {
    return await DeleteUserFactory.run(id, this.appHostService.app);
  }
}
