import type { INestApplication } from '@nestjs/common';
import type { User } from '@app/users/entities';
import type { EntityWithRelation } from '@app/users/types/entityWithRelation';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { ISimilarityFilterService, Type } from '@app/similarity-filter';
import type { PrismaService } from '@app/core/prisma/prisma.service';

import { UserDatabaseContract } from '@app/users/contracts';

import * as _ from 'lodash';

export class UserPrismaDB extends UserDatabaseContract {
  private readonly _prismaService: PrismaService;
  private readonly _similarityFilterService: ISimilarityFilterService;

  constructor(protected readonly app: INestApplication) {
    super(app);
    this._prismaService = this.app.get<PrismaService>('IPrismaService');
    this._similarityFilterService = this.app.get<ISimilarityFilterService>(
      'ISimilarityFilterService',
    );
  }

  async create(data: User): Promise<EntityWithRelation> {
    return (await this._prismaService.user.create({
      data: {
        id: data.id as string,
        username: data.username,
        email: data.email,
        password: data.password,
        roles: data.roles,
        hash: data.hash,
        activate: data.activate,
        session: data.session,
      },
      include: {
        files: true,
      },
    })) as EntityWithRelation;
  }

  async findAll(limit?: number, skip?: number): Promise<EntityWithRelation[]> {
    return (await this._prismaService.user.findMany({
      skip,
      take: limit,
      include: {
        files: true,
      },
    })) as EntityWithRelation[];
  }

  async findOne(id: string): Promise<EntityWithRelation | null> {
    return (await this._prismaService.user.findFirst({
      where: {
        id: id ?? '',
      },
      include: {
        files: true,
      },
    })) as EntityWithRelation;
  }

  async findBy(
    filter: RecursivePartial<EntityWithRelation>,
    similarity?: Type,
  ): Promise<EntityWithRelation[]> {
    const users = await this._prismaService.user.findMany({
      include: {
        files: true,
      },
    });

    return users.filter((user) =>
      this._similarityFilterService.execute<EntityWithRelation>(
        filter,
        user as EntityWithRelation,
        similarity || 'full',
      ),
    ) as EntityWithRelation[];
  }

  async findByEmail(email: string): Promise<EntityWithRelation | null> {
    const hash = this.hashText(email);

    return (await this._prismaService.user.findFirst({
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
    let data = _.omitBy(newData, _.isNil);
    data = _.omit(data, ['files']);
    return (await this._prismaService.user.update({
      where: { id },
      data,
      include: {
        files: true,
      },
    })) as EntityWithRelation;
  }

  async delete(id: string): Promise<boolean> {
    if ((await this._prismaService.user.count()) <= 0) return false;

    const user = await this._prismaService.user.delete({
      where: { id },
    });

    if (!user) return false;

    return true;
  }
}
