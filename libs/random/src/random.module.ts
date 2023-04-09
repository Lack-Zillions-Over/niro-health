import { Module } from '@nestjs/common';
import { StringExService } from '@app/string-ex';
import { RandomStringService } from './random.service';

@Module({
  providers: [RandomStringService, StringExService],
  exports: [RandomStringService],
})
export class RandomStringModule {}
