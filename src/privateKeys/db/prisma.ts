import { PrivateKeyDatabaseContract } from '@/privateKeys/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { PrivateKey } from '@/privateKeys/entities';
import { PrismaService } from '@/core/prisma/prisma.service';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import * as _ from 'lodash';

export class PrivateKeyPrismaDB extends PrivateKeyDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    private readonly prismaService: PrismaService,
  ) {
    super(libsService, utilsService);
  }

  async create(data: PrivateKey): Promise<PrivateKey> {
    return await this.prismaService.privateKey.create({ data });
  }

  async findAll(): Promise<PrivateKey[]> {
    return await this.prismaService.privateKey.findMany();
  }

  async findOne(id: string): Promise<PrivateKey | null> {
    return await this.prismaService.privateKey.findFirst({ where: { id } });
  }

  async findBy(
    filter: Partial<PrivateKey>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<PrivateKey[]> {
    const keys = await this.prismaService.privateKey.findMany();

    return keys.filter((key) =>
      this.utilsService
        .similarityFilter()
        .execute<PrivateKey>(filter, key as PrivateKey, similarity || 'full'),
    ) as PrivateKey[];
  }

  async findByTag(tag: string): Promise<PrivateKey | null> {
    return await this.prismaService.privateKey.findFirst({ where: { tag } });
  }

  async update(id: string, newData: PrivateKey): Promise<PrivateKey | null> {
    return await this.prismaService.privateKey.update({
      where: { id },
      data: { ..._.omitBy(newData, _.isNil) },
    });
  }

  async remove(id: string): Promise<boolean> {
    if ((await this.prismaService.privateKey.count()) <= 0) return false;

    const key = await this.prismaService.privateKey.delete({ where: { id } });

    if (!key) return false;

    return true;
  }
}
