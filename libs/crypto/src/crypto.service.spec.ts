import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { RandomStringService } from '@app/random';
import { StringExService } from '@app/string-ex';

jest.mock('ioredis', () => jest.requireActual('@test/mocks/ioredis'));

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService, RandomStringService, StringExService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be encrypt string', async () => {
    const text = 'Hello World';
    const encrypted = await service.encrypt(text);
    expect(encrypted).not.toBe(text);
  });

  it('should be decrypt string', async () => {
    const text = 'Hello World';
    const encrypted = await service.encrypt(text);
    const decrypted = await service.decrypt(encrypted);
    expect(text).toBe(decrypted);
  });
});
