import { Injectable } from '@nestjs/common';

import { CreateFileDto } from '@/files/dto/create';
import { UpdateFileDto } from '@/files/dto/update';

import { CreateFileFactory } from '@/files/factories/create';
import { FindByIdFactory } from '@/files/factories/findById';
import { FindByTemporaryFactory } from '@/files/factories/findByTemporary';
import { UpdateFileFactory } from '@/files/factories/update';
import { RemoveFactory } from '@/files/factories/remove';

import { PrismaService } from '@/core/prisma/prisma.service';
import { LibsService } from '@/core/libs/libs.service';
import { UtilsService } from '@/core/utils/utils.service';

@Injectable()
export class FilesService {
  constructor(
    public readonly prismaService: PrismaService,
    public readonly libsService: LibsService,
    public readonly utilsService: UtilsService,
  ) {}

  async create(file: CreateFileDto) {
    return await CreateFileFactory.run(
      file,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async update(id, newData: UpdateFileDto) {
    return await UpdateFileFactory.run(
      id,
      newData,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findById(id: string) {
    return await FindByIdFactory.run(
      id,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async findByTemporary() {
    return await FindByTemporaryFactory.run(
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }

  async remove(id: string) {
    return await RemoveFactory.run(
      id,
      this.prismaService,
      this.libsService,
      this.utilsService,
    );
  }
}
