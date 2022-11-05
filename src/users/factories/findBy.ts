import { FindByUser } from '@/users/usecases/findBy';
import { UserPrismaDB } from '@/users/db/prisma';
import { User } from '@/users/entities';

import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindByUserFactory {
  static async run(
    filter: RecursivePartial<User>,
    similarity: SimilarityFilterTypes.SimilarityType,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new UserPrismaDB(libsService, utilsService, prismaService);

    return await FindByUser.execute(
      filter,
      similarity,
      database,
      libsService,
      utilsService,
    );
  }
}
