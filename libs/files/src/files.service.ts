import { Injectable, Inject } from '@nestjs/common';

import { File } from '@app/files/entities';
import type { IAppHostService } from '@app/app-host';

import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';

import type { CreateFileDto } from '@app/files/dto/create';
import type { UpdateFileDto } from '@app/files/dto/update';

import { CreateFileFactory } from '@app/files/factories/create';
import { FindAllFilesFactory } from '@app/files/factories/findAll';
import { FindByIdFileFactory } from '@app/files/factories/findById';
import { FindByFileFactory } from './factories/findBy';
import { FindByTemporaryFileFactory } from '@app/files/factories/findByTemporary';
import { UpdateFileFactory } from '@app/files/factories/update';
import { DeleteFileFactory } from '@app/files/factories/delete';

@Injectable()
export class FilesService {
  constructor(
    @Inject('IAppHostService')
    private readonly appHostService: IAppHostService,
  ) {}

  async create(file: CreateFileDto) {
    return await CreateFileFactory.run(file, this.appHostService.app);
  }

  async findAll(limit?: number, skip?: number) {
    return await FindAllFilesFactory.run(
      {
        limit,
        skip,
      },
      this.appHostService.app,
    );
  }

  async findOne(id: string) {
    return await FindByIdFileFactory.run(id, this.appHostService.app);
  }

  async findBy(filter: RecursivePartial<File>, similarity: Type) {
    return await FindByFileFactory.run(
      filter,
      similarity,
      this.appHostService.app,
    );
  }

  async findByTemporary() {
    return await FindByTemporaryFileFactory.run(this.appHostService.app);
  }

  async update(id: string, newData: UpdateFileDto) {
    return await UpdateFileFactory.run(id, newData, this.appHostService.app);
  }

  async delete(id: string) {
    return await DeleteFileFactory.run(id, this.appHostService.app);
  }
}
