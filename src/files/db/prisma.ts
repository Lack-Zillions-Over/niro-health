import { FileDatabaseContract } from '@/files/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { File } from '@/files/entities';
import { PrismaService } from '@/core/prisma/prisma.service';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';
import { EntityWithRelation } from '@/files/types/entityWithRelation';

import * as _ from 'lodash';

export class FilePrismaDB extends FileDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    private readonly prismaService: PrismaService,
  ) {
    super(libsService, utilsService);
  }

  async create(data: File): Promise<EntityWithRelation> {
    return (await this.prismaService.file.create({
      data,
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async findAll(
    limit?: number,
    offset?: number,
  ): Promise<EntityWithRelation[]> {
    return (await this.prismaService.file.findMany({
      take: limit,
      skip: offset,
      include: {
        author: true,
      },
    })) as EntityWithRelation[];
  }

  async findOne(id: string): Promise<EntityWithRelation | null> {
    return (await this.prismaService.file.findFirst({
      where: { id },
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async findBy(
    filter: Partial<EntityWithRelation>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<EntityWithRelation[]> {
    const files = await this.prismaService.file.findMany({
      include: {
        author: true,
      },
    });

    return files.filter((file) =>
      this.utilsService
        .similarityFilter()
        .execute<EntityWithRelation>(
          filter,
          file as EntityWithRelation,
          similarity || 'full',
        ),
    ) as EntityWithRelation[];
  }

  async findByTag(tag: string): Promise<EntityWithRelation[]> {
    return (await this.prismaService.file.findMany({
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
    return (await this.prismaService.file.findMany({
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
    return (await this.prismaService.file.findFirst({
      where: { name, version },
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async findByAuthorId(authorId: string): Promise<EntityWithRelation[]> {
    return (await this.prismaService.file.findMany({
      where: { authorId },
      include: {
        author: true,
      },
    })) as EntityWithRelation[];
  }

  async findByTemporary(): Promise<EntityWithRelation[]> {
    return (await this.prismaService.file.findMany({
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
    return (await this.prismaService.file.update({
      where: { id },
      data: { ..._.omitBy(newData, _.isNil) },
      include: {
        author: true,
      },
    })) as EntityWithRelation;
  }

  async removeVersion(name: string, version: number): Promise<boolean> {
    const { count } = await this.prismaService.file.deleteMany({
      where: {
        name,
        version,
      },
    });

    return count > 0;
  }

  async remove(id: string): Promise<boolean> {
    if ((await this.prismaService.file.count()) <= 0) return false;

    const file = await this.prismaService.file.delete({
      where: { id },
    });

    if (!file) return false;

    return true;
  }
}
