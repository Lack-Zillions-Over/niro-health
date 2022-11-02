import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('author')
  async author() {
    return '@GuilhermeSantos001';
  }

  @Get('credits')
  async credits() {
    return `Niro Health ©2022 Created by ${await this.author()}`;
  }
}
