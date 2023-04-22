import { Test, TestingModule } from '@nestjs/testing';
import { AppHostService } from './app-host.service';

describe('AppHostService', () => {
  let service: AppHostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppHostService],
    }).compile();

    service = module.get<AppHostService>(AppHostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
