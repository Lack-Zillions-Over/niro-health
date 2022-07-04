import { Injectable } from '@nestjs/common';

import { CreatePrivateKeyDto } from './dto/create-private-keys.dto';
import { UpdatePrivateKeyDto } from './dto/update-private-keys.dto';

import { CreatePrivateKeyFactory } from './factories/create-private-keys.factory';
import { ValidatePrivateKeyFactory } from './factories/validate-private-keys.factory';
import { FindAllPrivateKeysFactory } from './factories/find-all-private-keys.factory';
import { FindByTagPrivateKeyFactory } from './factories/find-by-tag-private-keys.factory';
import { UpdatePrivateKeyFactory } from './factories/update-private-keys.factory';
import { RemovePrivateKeyFactory } from './factories/remove-private-keys.factory';

@Injectable()
export class CoreService {
  async createPrivateKey(key: CreatePrivateKeyDto) {
    return await CreatePrivateKeyFactory.run(key);
  }

  async validatePrivateKey(tag: string, secret: string, value: string) {
    return await ValidatePrivateKeyFactory.run(tag, secret, value);
  }

  async findAllPrivateKeys() {
    return await FindAllPrivateKeysFactory.run();
  }

  async findByTagPrivateKey(tag: string) {
    return await FindByTagPrivateKeyFactory.run(tag);
  }

  async updatePrivateKey(id: string, newData: UpdatePrivateKeyDto) {
    return await UpdatePrivateKeyFactory.run(id, newData);
  }

  async removePrivateKey(id: string) {
    return await RemovePrivateKeyFactory.run(id);
  }
}
