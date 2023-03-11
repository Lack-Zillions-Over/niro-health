import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service';

@Module({
  providers: [ArchiveService],
  exports: [ArchiveService],
})
export class ArchiveModule {}
