import { FileDatabaseContract } from '@/files/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { File } from '@/files/entities';
import { PrismaService } from '@/core/prisma/prisma.service';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import * as _ from 'lodash';

export class FilePrismaDB extends FileDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    private readonly prismaService: PrismaService,
  ) {
    super(libsService, utilsService);
  }

  async create(data: File): Promise<File> {
    return (await this.prismaService.file.create({ data })) as unknown as File;
  }

  async findAll(limit?: number, offset?: number): Promise<File[]> {
    return (await this.prismaService.file.findMany({
      take: limit,
      skip: offset,
    })) as unknown as File[];
  }

  async findOne(id: string): Promise<File | null> {
    return (await this.prismaService.file.findFirst({
      where: { id },
    })) as unknown as File;
  }

  async findBy(
    filter: Partial<File>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<File[]> {
    const users = await this.prismaService.file.findMany();

    return users.filter((user) =>
      this.utilsService
        .similarityFilter()
        .execute<File>(filter, user as unknown as File, similarity || 'full'),
    ) as unknown as File[];
  }

  async findByTag(tag: string): Promise<File[]> {
    return (await this.prismaService.file.findMany({
      where: {
        tags: {
          hasSome: [tag],
        },
      },
    })) as unknown as File[];
  }

  async findByName(name: string): Promise<File[]> {
    return (await this.prismaService.file.findMany({
      where: { name },
    })) as unknown as File[];
  }

  async findByVersion(name: string, version: number): Promise<File | null> {
    return (await this.prismaService.file.findFirst({
      where: { name, version },
    })) as unknown as File;
  }

  async findByAuthorId(authorId: string): Promise<File[]> {
    return (await this.prismaService.file.findMany({
      where: { authorId },
    })) as unknown as File[];
  }

  async findByTemporary(): Promise<File[]> {
    return (await this.prismaService.file.findMany({
      where: {
        temporary: {
          equals: true,
        },
      },
    })) as unknown as File[];
  }

  async update(id: string, newData: File): Promise<File | null> {
    return (await this.prismaService.file.update({
      where: { id },
      data: { ..._.omitBy(newData, _.isNil) },
    })) as unknown as File;
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
