import { Module } from '@nestjs/common';
import { LocalPathService } from './localpath.service';

@Module({
  providers: [LocalPathService],
  exports: [LocalPathService],
})
export class LocalPathModule {}
