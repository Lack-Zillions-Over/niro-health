import { Module } from '@nestjs/common';
import { RandomStringService } from './random-string.service';

@Module({
  providers: [RandomStringService],
  exports: [RandomStringService],
})
export class RandomStringModule {}
