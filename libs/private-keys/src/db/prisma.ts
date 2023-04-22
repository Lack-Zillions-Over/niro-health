import type { INestApplication } from '@nestjs/common';
import type { PrivateKey } from '@app/private-keys/entities';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { ISimilarityFilterService, Type } from '@app/similarity-filter';
import type { PrismaService } from '@app/core/prisma/prisma.service';

import { PrivateKeyDatabaseContract } from '@app/private-keys/contracts';

import * as _ from 'lodash';

export class PrivateKeyPrismaDB extends PrivateKeyDatabaseContract {
  private readonly _prismaService: PrismaService;
  private readonly _similarityFilterService: ISimilarityFilterService;

  constructor(protected readonly app: INestApplication) {
    super(app);
    this._prismaService = this.app.get<PrismaService>('IPrismaService');
    this._similarityFilterService = this.app.get<ISimilarityFilterService>(
      'ISimilarityFilterService',
    );
  }

  async create(data: PrivateKey): Promise<PrivateKey> {
    return (await this._prismaService.privateKey.create({
      data: {
        id: data.id as string,
        tag: data.tag,
        secret: data.secret,
        value: data.value,
      },
    })) as PrivateKey;
  }

  async findAll(limit?: number, offset?: number): Promise<PrivateKey[]> {
    return (await this._prismaService.privateKey.findMany({
      take: limit,
      skip: offset,
    })) as PrivateKey[];
  }

  async findOne(id: string): Promise<PrivateKey | null> {
    return (await this._prismaService.privateKey.findFirst({
      where: { id: id ?? '' },
    })) as PrivateKey;
  }

  async findBy(
    filter: RecursivePartial<PrivateKey>,
    similarity?: Type,
  ): Promise<PrivateKey[]> {
    const keys = await this._prismaService.privateKey.findMany();

    return keys.filter((key) =>
      this._similarityFilterService.execute<PrivateKey>(
        filter,
        key as PrivateKey,
        similarity || 'full',
      ),
    ) as PrivateKey[];
  }

  async findByTag(tag: string): Promise<PrivateKey | null> {
    return (await this._prismaService.privateKey.findFirst({
      where: { tag },
    })) as PrivateKey;
  }

  async update(id: string, newData: PrivateKey): Promise<PrivateKey | null> {
    const data = _.omitBy(newData, _.isNil);
    return (await this._prismaService.privateKey.update({
      where: { id },
      data,
    })) as PrivateKey;
  }

  async delete(id: string): Promise<boolean> {
    if ((await this._prismaService.privateKey.count()) <= 0) return false;

    const key = await this._prismaService.privateKey.delete({ where: { id } });

    if (!key) return false;

    return true;
  }
}
