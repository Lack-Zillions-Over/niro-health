import { FindByPrivateKey } from '@/privateKeys/usecases/findBy';
import { PrivateKeyPrismaDB } from '@/privateKeys/db/prisma';
import { PrivateKey } from '@/privateKeys/entities';

import { RecursivePartial } from '@/core/common/types/recursive-partial.type';
import { SimilarityFilter as SimilarityFilterTypes } from '@/core/utils/similarityFilter/types';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindByPrivateKeyFactory {
  static async run(
    filter: RecursivePartial<PrivateKey>,
    similarity: SimilarityFilterTypes.SimilarityType,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new PrivateKeyPrismaDB(
      libsService,
      utilsService,
      prismaService,
    );

    return await FindByPrivateKey.execute(
      filter,
      similarity,
      database,
      libsService,
      utilsService,
    );
  }
}
