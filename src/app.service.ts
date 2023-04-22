import { Inject, Injectable } from '@nestjs/common';
import type { IConfigurationService } from '@app/configuration';
@Injectable()
export class AppService {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {}

  author() {
    return `GuilhermeSantos001`;
  }

  credits() {
    return `Niro Health ©2022 Created by ${this.author()}`;
  }

  version() {
    return this.configurationService.VERSION;
  }
}
