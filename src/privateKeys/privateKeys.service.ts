import { Injectable } from '@nestjs/common';

import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { lookup } from 'geoip-lite';

import { PrivateKey } from '@/privateKeys/entities';

import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import { CreatePrivateKeyDto } from '@/privateKeys/dto/create';
import { UpdatePrivateKeyDto } from '@/privateKeys/dto/update';

import { CreatePrivateKeyFactory } from '@/privateKeys/factories/create';
import { ValidatePrivateKeyFactory } from '@/privateKeys/factories/validate';
import { FindAllPrivateKeysFactory } from '@/privateKeys/factories/findAll';
import { FindByPrivateKeyFactory } from '@/privateKeys/factories/findBy';
import { FindByTagPrivateKeyFactory } from '@/privateKeys/factories/findByTag';
import { UpdatePrivateKeyFactory } from '@/privateKeys/factories/update';
import { DecryptFieldValuePrivateKeyFactory } from '@/privateKeys/factories/decryptFieldValue';
import { RemovePrivateKeyFactory } from '@/privateKeys/factories/remove';

import { PrismaService } from '@/core/prisma/prisma.service';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

@Injectable()
export class PrivateKeysService {
  constructor(
    public readonly prismaService: PrismaService,
    public readonly libsService: LibsService,
    public readonly utilsService: UtilsService,
  ) {}

  async getClientGeoIP(req: Request) {
    const ipAddress = getClientIp(req);

    return {
      ...lookup(ipAddress),
      device_name: req.headers['user-agent'],
      ipAddress,
    };
  }

  async getCookie(req: Request, name: string) {
    return req.cookies[name] as string;
  }

  async createPrivateKey(key: CreatePrivateKeyDto) {
    return await CreatePrivateKeyFactory.run(
      key,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async validatePrivateKey(tag: string, secret: string, value: string) {
    return await ValidatePrivateKeyFactory.run(
      tag,
      secret,
      value,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findAllPrivateKeys() {
    return await FindAllPrivateKeysFactory.run(
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findByPrivateKeys(
    filter: RecursivePartial<PrivateKey>,
    similarity: SimilarityFilterTypes.SimilarityType,
  ) {
    return await FindByPrivateKeyFactory.run(
      filter,
      similarity,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findByTagPrivateKey(tag: string) {
    return await FindByTagPrivateKeyFactory.run(
      tag,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async decryptFieldValuePrivateKey(value: string) {
    return await DecryptFieldValuePrivateKeyFactory.run(
      value,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async updatePrivateKey(id: string, newData: UpdatePrivateKeyDto) {
    return await UpdatePrivateKeyFactory.run(
      id,
      newData,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async removePrivateKey(id: string) {
    return await RemovePrivateKeyFactory.run(
      id,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }
}
