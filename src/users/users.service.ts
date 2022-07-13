import { Injectable } from '@nestjs/common';

import { CreateUserDto } from '@/users/dto/create-users.dto';
import { UpdateUserDto } from '@/users/dto/update-users.dto';

import { LocaleService } from '@/core/i18n/i18n.service';
import { GeoIP } from '@/core/types/geo-ip.type';

import { CreateUserFactory } from '@/users/factories/create-users.factory';
import { LoginUserFactory } from '@/users/factories/login-users.factory';
import { SessionValidateUserFactory } from './factories/session-validate.factory';
import { LogoutUserFactory } from './factories/logout-users.factory';
import { FindAllUsersFactory } from '@/users/factories/find-all-users.factory';
import { FindByIdUserFactory } from '@/users/factories/find-by-id-users.factory';
import { FindByUsernameUserFactory } from '@/users/factories/find-by-username-users.factory';
import { UpdateUserFactory } from '@/users/factories/update-users.factory';
import { RemoveUserFactory } from '@/users/factories/remove-users.factory';

@Injectable()
export class UsersService {
  constructor(private readonly localeService: LocaleService) {}

  async create(user: CreateUserDto) {
    return await CreateUserFactory.run(user, this.localeService.locale);
  }

  async login(
    username: string,
    password: string,
    device_name: string,
    geo_ip: GeoIP,
  ) {
    return await LoginUserFactory.run(
      username,
      password,
      device_name,
      geo_ip,
      this.localeService.locale,
    );
  }

  async sessionValidate(
    username: string,
    token_value: string,
    token_signature: string,
    token_revalidate_value: string,
    token_revalidate_signature: string,
    device_name: string,
    geo_ip: GeoIP,
  ) {
    return await SessionValidateUserFactory.run(
      username,
      token_value,
      token_signature,
      token_revalidate_value,
      token_revalidate_signature,
      device_name,
      geo_ip,
      this.localeService.locale,
    );
  }

  async logout(username: string, token_value: string, device_name: string) {
    return await LogoutUserFactory.run(
      username,
      token_value,
      device_name,
      this.localeService.locale,
    );
  }

  async findAll() {
    return await FindAllUsersFactory.run(this.localeService.locale);
  }

  async findOne(id: string) {
    return await FindByIdUserFactory.run(id, this.localeService.locale);
  }

  async findByUsername(username: string) {
    return await FindByUsernameUserFactory.run(
      username,
      this.localeService.locale,
    );
  }

  async update(id: string, newData: UpdateUserDto) {
    return await UpdateUserFactory.run(id, newData, this.localeService.locale);
  }

  async remove(id: string) {
    return await RemoveUserFactory.run(id, this.localeService.locale);
  }
}
