import { FindAllFiles } from '@/files/usecases/findAll';
import { FilePrismaDB } from '@/files/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindAllFilesFactory {
  static async run(
    query: {
      limit?: number;
      offset?: number;
    },
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new FilePrismaDB(libsService, utilsService, prismaService);

    return await FindAllFiles.execute(
      query,
      database,
      libsService,
      utilsService,
    );
  }
}
