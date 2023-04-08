import { Test, TestingModule } from '@nestjs/testing';
import { LocalPathService } from './localpath.service';

describe('LocalPathService', () => {
  let service: LocalPathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalPathService],
    }).compile();

    service = module.get<LocalPathService>(LocalPathService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get local path', () => {
    expect(service.local('testing')).toContain('/testing');
  });

  it('should be create local path', () => {
    expect(service.localCreate('dist/test/localpath')).toBeUndefined();
  });

  it('should be exist local path', () => {
    expect(service.localExists('dist/test/localpath')).toBe(true);
  });
});
