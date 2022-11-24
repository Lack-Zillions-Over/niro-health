import { Module } from '@nestjs/common';
import { CoreModule } from '@/core/core.module';
import { FilesService } from '@/files/files.service';
import { FilesController } from '@/files/files.controller';
import { FilesParser } from '@/files/parsers';

@Module({
  imports: [CoreModule],
  controllers: [FilesController],
  providers: [FilesService, FilesParser],
})
export class FilesModule {}
