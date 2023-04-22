import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { DebugService } from '@app/debug';
import { FilesClearTemporarySchedule } from '@app/schedules/files/clearTemporary';
import { FilesService } from '@app/files';
import { AppHostService } from '@app/app-host';

describe('SchedulesService', () => {
  let service: SchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesClearTemporarySchedule,
        SchedulesService,
        AppHostService,
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'IFilesService', useClass: FilesService },
      ],
    }).compile();

    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
