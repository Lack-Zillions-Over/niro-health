import { Module } from '@nestjs/common';
import { PropStringService } from './prop-string.service';

@Module({
  providers: [PropStringService],
  exports: [PropStringService],
})
export class PropStringModule {}
