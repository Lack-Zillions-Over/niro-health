import { Controller, Get } from '@nestjs/common';
import { AppService } from '@/app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  get author() {
    return this.appService.author();
  }

  get repository() {
    return 'https://github.com/Lack-Zillions-Over/niro-health';
  }

  get license() {
    return 'https://github.com/Lack-Zillions-Over/niro-health/blob/main/LICENSE';
  }

  get credits() {
    return this.appService.credits();
  }

  get version() {
    return this.appService.version();
  }

  @Get()
  info() {
    return {
      author: this.author,
      repository: this.repository,
      license: this.license,
      credits: this.credits,
      version: this.version,
    };
  }
}
