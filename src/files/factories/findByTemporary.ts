import { FindByTemporaryFile } from '@/files/usecases/findByTemporary';
import { FilePrismaDB } from '@/files/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindByTemporaryFactory {
  static async run(
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new FilePrismaDB(libsService, utilsService, prismaService);

    return await FindByTemporaryFile.execute(
      database,
      libsService,
      utilsService,
    );
  }
}
