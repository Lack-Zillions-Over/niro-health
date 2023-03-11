import { Module } from '@nestjs/common';
import { BjsonService } from './bjson.service';

@Module({
  providers: [BjsonService],
  exports: [BjsonService],
})
export class BjsonModule {}
