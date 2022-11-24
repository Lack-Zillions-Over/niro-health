import { UpdateFile } from '@/files/usecases/update';
import { FilePrismaDB } from '@/files/db/prisma';
import { UpdateFileDto } from '@/files/dto/update';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class UpdateFileFactory {
  static async run(
    id: string,
    newData: UpdateFileDto,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new FilePrismaDB(libsService, utilsService, prismaService);

    return await UpdateFile.execute(
      id,
      newData,
      database,
      libsService,
      utilsService,
    );
  }
}
