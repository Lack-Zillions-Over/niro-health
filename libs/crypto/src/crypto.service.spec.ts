import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { ConfigurationService } from '@app/configuration';
import { RedisService } from '@app/redis';
import { SqliteService } from '@app/sqlite';
import { RandomStringService } from '@app/random';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

jest.mock('ioredis', () => jest.requireActual('@test/mocks/ioredis'));

describe('CryptoService', () => {
  let service: CryptoService;
  let configurationService: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        ConfigurationService,
        DebugService,
        ValidatorRegexpService,
        StringExService,
        RedisService,
        SqliteService,
        RandomStringService,
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    configurationService =
      module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Tests - Driver: File System', () => {
    beforeAll(() => {
      configurationService.setVariable('crypto_driver', 'fs');
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

  describe('Tests - Driver: Sqlite', () => {
    beforeAll(() => {
      configurationService.setVariable('crypto_driver', 'sqlite');
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

  describe('Tests - Driver: Redis', () => {
    beforeAll(() => {
      configurationService.setVariable('crypto_driver', 'redis');
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
});
