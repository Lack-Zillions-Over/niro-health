import { Module } from '@nestjs/common';
import { ValidatorRegexpService } from './validator-regexp.service';

@Module({
  providers: [ValidatorRegexpService],
  exports: [ValidatorRegexpService],
})
export class ValidatorRegexpModule {}
