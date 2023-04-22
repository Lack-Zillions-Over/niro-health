import { Test, TestingModule } from '@nestjs/testing';
import { PrivateKeysService } from './private-keys.service';

describe('PrivateKeysService', () => {
  let service: PrivateKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateKeysService],
    }).compile();

    service = module.get<PrivateKeysService>(PrivateKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
