import { Module } from '@nestjs/common';
import { StringExService } from './string-ex.service';

@Module({
  providers: [StringExService],
  exports: [StringExService],
})
export class StringExModule {}
