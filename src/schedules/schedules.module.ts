import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CoreModule } from '@/core/core.module';

import { FilesService } from '@/files/files.service';

import { FilesClearTemporarySchedule } from '@/schedules/files/clearTemporary';

@Module({
  imports: [ScheduleModule.forRoot(), CoreModule],
  providers: [FilesClearTemporarySchedule, FilesService],
})
export class SchedulesModule {}
