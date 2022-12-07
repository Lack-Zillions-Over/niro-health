import { UserDatabaseContract } from '@/users/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { User } from '@/users/entities';
import { PrismaService } from '@/core/prisma/prisma.service';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';
import { EntityWithRelation } from '@/users/types/entityWithRelation';

import * as _ from 'lodash';

export class UserPrismaDB extends UserDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    private readonly prismaService: PrismaService,
  ) {
    super(libsService, utilsService);
  }

  async create(data: User): Promise<EntityWithRelation> {
    return (await this.prismaService.user.create({
      data,
      include: {
        files: true,
      },
    })) as EntityWithRelation;
  }

  async findAll(
    limit?: number,
    offset?: number,
  ): Promise<EntityWithRelation[]> {
    return (await this.prismaService.user.findMany({
      take: limit,
      skip: offset,
      include: {
        files: true,
      },
    })) as EntityWithRelation[];
  }

  async findOne(id: string): Promise<EntityWithRelation | null> {
    return (await this.prismaService.user.findFirst({
      where: { id },
      include: {
        files: true,
      },
    })) as EntityWithRelation;
  }

  async findBy(
    filter: Partial<EntityWithRelation>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<EntityWithRelation[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        files: true,
      },
    });

    return users.filter((user) =>
      this.utilsService
        .similarityFilter()
        .execute<EntityWithRelation>(
          filter,
          user as EntityWithRelation,
          similarity || 'full',
        ),
    ) as EntityWithRelation[];
  }

  async findByEmail(email: string): Promise<EntityWithRelation | null> {
    const hash = this.hashByText(email);

    return (await this.prismaService.user.findFirst({
      where: {
        hash: {
          path: ['email'],
          equals: hash,
        },
      },
      include: {
        files: true,
      },
    })) as EntityWithRelation;
  }

  async update(id: string, newData: User): Promise<EntityWithRelation | null> {
    return (await this.prismaService.user.update({
      where: { id },
      data: { ..._.omitBy(newData, _.isNil) },
      include: {
        files: true,
      },
    })) as EntityWithRelation;
  }

  async remove(id: string): Promise<boolean> {
    if ((await this.prismaService.user.count()) <= 0) return false;

    const user = await this.prismaService.user.delete({
      where: { id },
    });

    if (!user) return false;

    return true;
  }
}
