import { Injectable } from '@nestjs/common';

import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { lookup } from 'geoip-lite';

import { CreatePrivateKeyDto } from '@/core/dto/create-private-keys.dto';
import { UpdatePrivateKeyDto } from '@/core/dto/update-private-keys.dto';

import { CreatePrivateKeyFactory } from '@/core/factories/create-private-keys.factory';
import { ValidatePrivateKeyFactory } from '@/core/factories/validate-private-keys.factory';
import { FindAllPrivateKeysFactory } from '@/core/factories/find-all-private-keys.factory';
import { FindByTagPrivateKeyFactory } from '@/core/factories/find-by-tag-private-keys.factory';
import { UpdatePrivateKeyFactory } from '@/core/factories/update-private-keys.factory';
import { RemovePrivateKeyFactory } from '@/core/factories/remove-private-keys.factory';

import { LocaleService } from '@/core/i18n/i18n.service';

@Injectable()
export class CoreService {
  constructor(private readonly localeService: LocaleService) {}
  async getClientGeoIP(req: Request) {
    const ipAddress = getClientIp(req);

    return {
      ...lookup(ipAddress),
      device_name: req.headers['user-agent'],
      ipAddress,
    };
  }

  async getCookie(req: Request, name: string) {
    return req.cookies[name] as string;
  }

  async createPrivateKey(key: CreatePrivateKeyDto) {
    return await CreatePrivateKeyFactory.run(key, this.localeService.locale);
  }

  async validatePrivateKey(tag: string, secret: string, value: string) {
    return await ValidatePrivateKeyFactory.run(
      tag,
      secret,
      value,
      this.localeService.locale,
    );
  }

  async findAllPrivateKeys() {
    return await FindAllPrivateKeysFactory.run(this.localeService.locale);
  }

  async findByTagPrivateKey(tag: string) {
    return await FindByTagPrivateKeyFactory.run(tag, this.localeService.locale);
  }

  async updatePrivateKey(id: string, newData: UpdatePrivateKeyDto) {
    return await UpdatePrivateKeyFactory.run(
      id,
      newData,
      this.localeService.locale,
    );
  }

  async removePrivateKey(id: string) {
    return await RemovePrivateKeyFactory.run(id, this.localeService.locale);
  }
}
