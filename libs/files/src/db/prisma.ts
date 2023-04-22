import type { INestApplication } from '@nestjs/common';
import type { File } from '@app/files/entities';
import type { EntityWithRelation } from '@app/files/types/entityWithRelation';
import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { ISimilarityFilterService, Type } from '@app/similarity-filter';
import type { PrismaService } from '@app/core/prisma/prisma.service';

import { FileDatabaseContract } from '@app/files/contracts';

import * as _ from 'lodash';

export class FilePrismaDB extends FileDatabaseContract {
  private readonly _prismaService: PrismaService;
  private readonly _similarityFilterService: ISimilarityFilterService;

  constructor(protected readonly app: INestApplication) {
    super(app);
    this._prismaService = this.app.get<PrismaService>('IPrismaService');
    this._similarityFilterService = this.app.get<ISimilarityFilterService>(
      'ISimilarityFilterService',
    );
  }

  async create(data: File): Promise<EntityWithRelation> {
    return (await this._prismaService.file.create({
      data: {
        id: data.id as string,
        authorId: data.authorId,
        name: data.name,
        mimetype: data.mimetype,
        description: data.description,
        size: data.size,
        compressedSize: data.compressedSize,
        version: data.version,
        temporary: data.temporary,
        tags: data.tags,
        meta: data.meta,
        expiredAt: data.expiredAt,
      },
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async findAll(limit?: number, skip?: number): Promise<EntityWithRelation[]> {
    return (await this._prismaService.file.findMany({
      skip,
      take: limit,
      include: {
        author: true,
      },
    })) as EntityWithRelation[];
  }

  async findOne(id: string): Promise<EntityWithRelation | null> {
    return (await this._prismaService.file.findFirst({
      where: { id },
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async findBy(
    filter: RecursivePartial<EntityWithRelation>,
    similarity?: Type,
  ): Promise<EntityWithRelation[]> {
    const files = await this._prismaService.file.findMany({
      include: {
        author: true,
      },
    });

    return files.filter((file) =>
      this._similarityFilterService.execute<EntityWithRelation>(
        filter,
        file as any,
        similarity || 'full',
      ),
    ) as EntityWithRelation[];
  }

  async findByTag(tag: string): Promise<EntityWithRelation[]> {
    return (await this._prismaService.file.findMany({
      where: {
        tags: {
          hasSome: [tag],
        },
      },
      include: {
        author: true,
      },
    })) as EntityWithRelation[];
  }

  async findByName(name: string): Promise<EntityWithRelation[]> {
    return (await this._prismaService.file.findMany({
      where: { name },
      include: {
        author: true,
      },
    })) as EntityWithRelation[];
  }

  async findByVersion(
    name: string,
    version: number,
  ): Promise<EntityWithRelation | null> {
    return (await this._prismaService.file.findFirst({
      where: { name, version },
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async findByAuthorId(authorId: string): Promise<EntityWithRelation[]> {
    return (await this._prismaService.file.findMany({
      where: { authorId },
      include: {
        author: true,
      },
    })) as EntityWithRelation[];
  }

  async findByTemporary(): Promise<EntityWithRelation[]> {
    return (await this._prismaService.file.findMany({
      where: {
        temporary: {
          equals: true,
        },
      },
      include: {
        author: true,
      },
    })) as EntityWithRelation[];
  }

  async update(id: string, newData: File): Promise<EntityWithRelation | null> {
    let data = _.omitBy(newData, _.isNil);
    data = _.omit(data, ['author']);
    return (await this._prismaService.file.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async removeVersion(name: string, version: number): Promise<boolean> {
    const { count } = await this._prismaService.file.deleteMany({
      where: {
        name,
        version,
      },
    });

    return count > 0;
  }

  async delete(id: string): Promise<boolean> {
    if ((await this._prismaService.file.count()) <= 0) return false;

    const file = await this._prismaService.file.delete({
      where: { id },
    });

    if (!file) return false;

    return true;
  }
}
