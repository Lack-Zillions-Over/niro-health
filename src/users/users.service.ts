import { Injectable } from '@nestjs/common';

import { User } from '@/users/entities';

import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import { CreateUserDto } from '@/users/dto/create';
import { UpdateUserDto } from '@/users/dto/update';

import { CreateUserFactory } from '@/users/factories/create';
import { ActivateUserFactory } from '@/users/factories/activate';
import { LoginUserFactory } from '@/users/factories/login';
import { SessionValidateUserFactory } from '@/users/factories/sessionValidate';
import { LogoutUserFactory } from '@/users/factories/logout';
import { FindAllUsersFactory } from '@/users/factories/findAll';
import { FindByIdUserFactory } from '@/users/factories/findById';
import { FindByUserFactory } from '@/users/factories/findBy';
import { UpdateUserFactory } from '@/users/factories/update';
import { DecryptFieldValueUserFactory } from '@/users/factories/decryptFieldValue';
import { RemoveUserFactory } from '@/users/factories/remove';

import { PrismaService } from '@/core/prisma/prisma.service';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

import { GeoIP } from '@/core/types/geo-ip.type';

@Injectable()
export class UsersService {
  constructor(
    public readonly prismaService: PrismaService,
    public readonly libsService: LibsService,
    public readonly utilsService: UtilsService,
  ) {}

  async create(user: CreateUserDto) {
    return await CreateUserFactory.run(
      user,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async activate(id: string) {
    return await ActivateUserFactory.run(
      id,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
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
      this.prismaService,
      this.libsService,
      this.utilsService,
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
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async logout(id: string, token_value: string) {
    return await LogoutUserFactory.run(
      id,
      token_value,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findAll(limit?: number, offset?: number) {
    return await FindAllUsersFactory.run(
      {
        limit,
        offset,
      },
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findOne(id: string) {
    return await FindByIdUserFactory.run(
      id,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findBy(
    filter: RecursivePartial<User>,
    similarity: SimilarityFilterTypes.SimilarityType,
  ) {
    return await FindByUserFactory.run(
      filter,
      similarity,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async decryptFieldValue(value: string) {
    return await DecryptFieldValueUserFactory.run(
      value,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async update(id: string, newData: UpdateUserDto) {
    return await UpdateUserFactory.run(
      id,
      newData,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async remove(id: string) {
    return await RemoveUserFactory.run(
      id,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }
}
