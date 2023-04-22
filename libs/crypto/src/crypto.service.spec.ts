import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { RedisService } from '@app/core/redis/redis.service';
import { SqliteService } from '@app/core/sqlite/sqlite.service';
import { DebugService } from '@app/debug';
import { RandomService } from '@app/random';

jest.mock('ioredis', () => jest.requireActual('@test/mocks/ioredis'));

describe('CryptoService', () => {
  let service: CryptoService;
  let configurationService: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        { provide: 'IRedisService', useClass: RedisService },
        { provide: 'ISqliteService', useClass: SqliteService },
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'IRandomService', useClass: RandomService },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    configurationService = module.get<ConfigurationService>(
      'IConfigurationService',
    );
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
