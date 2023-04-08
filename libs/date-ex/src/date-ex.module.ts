import { Module } from '@nestjs/common';
import { DateExService } from './date-ex.service';

@Module({
  providers: [DateExService],
  exports: [DateExService],
})
export class DateExModule {}
