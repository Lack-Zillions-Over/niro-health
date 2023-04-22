import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { DebugService } from '@app/debug';
import { FilesClearTemporarySchedule } from '@app/schedules/files/clearTemporary';
import { FilesService } from '@app/files';
import { SchedulesService } from '@app/schedules/schedules.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    FilesClearTemporarySchedule,
    SchedulesService,
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IFilesService', useClass: FilesService },
  ],
  exports: [SchedulesService],
})
export class SchedulesModule {}
