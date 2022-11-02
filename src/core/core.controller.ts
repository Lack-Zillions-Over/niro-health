import { Controller, Get } from '@nestjs/common';

@Controller('api/core')
export class CoreController {
  @Get()
  async version() {
    return '1.0.0';
  }
}
