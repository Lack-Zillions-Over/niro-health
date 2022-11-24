import { CreateFile } from '@/files/usecases/create';
import { FilePrismaDB } from '@/files/db/prisma';
import { CreateFileDto } from '@/files/dto/create';

import { PrismaService } from '@/core/prisma/prisma.service';

import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

export class CreateFileFactory {
  static async run(
    file: CreateFileDto,
    prismaService: PrismaService,
    libsService: LibsService,
    utilsService: UtilsService,
  ) {
    const database = new FilePrismaDB(libsService, utilsService, prismaService);

    return await CreateFile.execute(file, database, libsService, utilsService);
  }
}
