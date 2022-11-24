import { FindByIdFile } from '@/files/usecases/findById';
import { FilePrismaDB } from '@/files/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class FindByIdFactory {
  static async run(
    id: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new FilePrismaDB(libsService, utilsService, prismaService);

    return await FindByIdFile.execute(id, database, libsService, utilsService);
  }
}
