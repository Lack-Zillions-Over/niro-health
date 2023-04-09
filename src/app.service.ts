import { Injectable } from '@nestjs/common';
import { ConfigurationService } from '@app/configuration';
@Injectable()
export class AppService {
  constructor(private readonly configurationService: ConfigurationService) {}

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
