import { Module } from '@nestjs/common';
import { LibsService } from '@/core/libs/libs.service';

@Module({
  providers: [LibsService],
  exports: [LibsService],
})
export class LibsModule {}
