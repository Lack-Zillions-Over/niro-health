import { RemoveFile } from '@/files/usecases/remove';
import { FilePrismaDB } from '@/files/db/prisma';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class RemoveFactory {
  static async run(
    id: string,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new FilePrismaDB(libsService, utilsService, prismaService);

    return await RemoveFile.execute(id, database, libsService, utilsService);
  }
}
