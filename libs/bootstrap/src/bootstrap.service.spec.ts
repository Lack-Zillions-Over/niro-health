import { Test, TestingModule } from '@nestjs/testing';
import { BootstrapService } from './bootstrap.service';

describe('BootstrapService', () => {
  let service: BootstrapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BootstrapService],
    }).compile();

    service = module.get<BootstrapService>(BootstrapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be main defined', () => {
    expect(service.main).not.toBeNull();
    expect(service.main).not.toBeUndefined();
  });
});
