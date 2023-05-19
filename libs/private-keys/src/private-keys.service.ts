import { Inject, Injectable } from '@nestjs/common';

import { PrivateKey } from '@app/private-keys/entities';
import { IAppHostService } from '@app/app-host';
import { IStringExService } from '@app/string-ex';
import { IRandomService } from '@app/random';

import type { RecursivePartial } from '@app/core/common/types/recursive-partial.type';
import type { Type } from '@app/similarity-filter';

import { CreatePrivateKeyDto } from '@app/private-keys/dto/create';
import { UpdatePrivateKeyDto } from '@app/private-keys/dto/update';

import { CreatePrivateKeyFactory } from '@app/private-keys/factories/create';
import { ValidatePrivateKeyFactory } from '@app/private-keys/factories/validate';
import { FindAllPrivateKeysFactory } from '@app/private-keys/factories/findAll';
import { FindByPrivateKeyFactory } from '@app/private-keys/factories/findBy';
import { FindByTagPrivateKeyFactory } from '@app/private-keys/factories/findByTag';
import { UpdatePrivateKeyFactory } from '@app/private-keys/factories/update';
import { DeletePrivateKeyFactory } from '@app/private-keys/factories/delete';

@Injectable()
export class PrivateKeysService {
  constructor(
    @Inject('IAppHostService')
    private readonly appHostService: IAppHostService,
    @Inject('IStringExService')
    private readonly stringExService: IStringExService,
    @Inject('IRandomService') private readonly randomService: IRandomService,
  ) {}

  async makeMasterKey(key: string) {
    if (!key) key = this.randomService.string(32);
    return this.stringExService.hash(key, 'sha256', 'hex');
  }

  async createPrivateKey(key: CreatePrivateKeyDto) {
    return await CreatePrivateKeyFactory.run(key, this.appHostService.app);
  }

  async validatePrivateKey(tag: string, secret: string, value: string) {
    return await ValidatePrivateKeyFactory.run(
      tag,
      secret,
      value,
      this.appHostService.app,
    );
  }

  async findAllPrivateKeys(limit?: number, offset?: number) {
    return await FindAllPrivateKeysFactory.run(
      {
        limit,
        offset,
      },
      this.appHostService.app,
    );
  }

  async findByPrivateKeys(
    filter: RecursivePartial<PrivateKey>,
    similarity: Type,
  ) {
    return await FindByPrivateKeyFactory.run(
      filter,
      similarity,
      this.appHostService.app,
    );
  }

  async findByTagPrivateKey(tag: string) {
    return await FindByTagPrivateKeyFactory.run(tag, this.appHostService.app);
  }

  async updatePrivateKey(id: string, newData: UpdatePrivateKeyDto) {
    return await UpdatePrivateKeyFactory.run(
      id,
      newData,
      this.appHostService.app,
    );
  }

  async deletePrivateKey(id: string) {
    return await DeletePrivateKeyFactory.run(id, this.appHostService.app);
  }
}
