import { UserDatabaseContract } from '@/users/contracts';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';
import { User } from '@/users/entities';
import { PrismaService } from '@/core/prisma/prisma.service';

import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import * as _ from 'lodash';

export class UserPrismaDB extends UserDatabaseContract {
  constructor(
    protected readonly libsService: LibsService,
    protected readonly utilsService: UtilsService,
    private readonly prismaService: PrismaService,
  ) {
    super(libsService, utilsService);
  }

  async create(data): Promise<User> {
    return (await this.prismaService.user.create({
      data,
    })) as unknown as User;
  }

  async findAll(): Promise<User[]> {
    return (await this.prismaService.user.findMany()) as unknown as User[];
  }

  async findOne(id: string): Promise<User | null> {
    return (await this.prismaService.user.findFirst({
      where: { id },
    })) as unknown as User;
  }

  async findBy(
    filter: Partial<User>,
    similarity?: SimilarityFilterTypes.SimilarityType,
  ): Promise<User[]> {
    const users = await this.prismaService.user.findMany();

    return users.filter((user) =>
      this.utilsService
        .similarityFilter()
        .execute<User>(filter, user as unknown as User, similarity || 'full'),
    ) as unknown as User[];
  }

  async findByEmail(email: string): Promise<User | null> {
    const hash = this.hashByText(email);

    return (await this.prismaService.user.findFirst({
      where: {
        hash: {
          path: ['email'],
          equals: hash,
        },
      },
    })) as unknown as User;
  }

  async update(id: string, newData: User): Promise<User | null> {
    return (await this.prismaService.user.update({
      where: { id },
      data: { ..._.omitBy(newData, _.isNil) },
    })) as unknown as User;
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
