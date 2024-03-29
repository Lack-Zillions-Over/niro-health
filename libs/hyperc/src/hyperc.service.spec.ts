import { Test, TestingModule } from '@nestjs/testing';
import { HypercService } from './hyperc.service';
import { RedisService } from '@app/core/redis/redis.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

jest.mock('ioredis', () => jest.requireActual('@test/mocks/ioredis'));

describe('HypercService', () => {
  let service: HypercService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HypercService,
        { provide: 'IRedisService', useClass: RedisService },
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
      ],
    }).compile();

    service = module.get<HypercService>(HypercService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a new cache with a ttl in milliseconds(ms)', async () => {
    await expect(service.create('testing', 1000)).resolves.toBe(true);
  });

  describe('Tests Consumption Cache', () => {
    it('should be set a new value(string) in the cache', async () => {
      await expect(service.create('testing', 1000)).resolves.toBe(true);
      await expect(service.set('testing', 'say', 'Hello World')).resolves.toBe(
        true,
      );
    });

    it('should be get a value(string) in the cache', async () => {
      await expect(service.create('testing', 1000)).resolves.toBe(true);
      await expect(service.set('testing', 'say', 'Hello World')).resolves.toBe(
        true,
      );
      await expect(service.get('testing', 'say')).resolves.toBe('Hello World');
    });

    it('should not be return a value for a key that does not exist in the cache', async () => {
      await expect(service.create('testing', 1000)).resolves.toBe(true);
      await expect(service.get('testing', 'hi')).resolves.toBeNull();
    });

    it('should be delete a value from the cache', async () => {
      await expect(service.create('testing', 1000)).resolves.toBe(true);
      await expect(service.set('testing', 'say', 'Hello World')).resolves.toBe(
        true,
      );
      await expect(service.del('testing', 'say')).resolves.toBe(true);
      await expect(service.get('testing', 'say')).resolves.toBeNull();
    });

    it('should be delete all values from the cache', async () => {
      await expect(service.create('testing', 1000)).resolves.toBe(true);
      await expect(service.set('testing', 'say', 'Hello World')).resolves.toBe(
        true,
      );
      await expect(service.flush('testing')).resolves.toBe(true);
      await expect(service.get('testing', 'say')).resolves.toBeNull();
    });

    it('should be delete all values from all caches', async () => {
      await expect(service.create('testing', 1000)).resolves.toBe(true);
      await expect(service.set('testing', 'say', 'Hello World')).resolves.toBe(
        true,
      );
      await expect(service.flushAll()).resolves.toBe(true);
      await expect(service.get('testing', 'say')).resolves.toBeNull();
    });
  });
});
