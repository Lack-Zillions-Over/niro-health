import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

jest.mock('ioredis', () => jest.requireActual('@test/mocks/ioredis'));

describe('RedisService', () => {
  describe('Test - Environment variables truthy', () => {
    let service: RedisService;

    beforeAll(() => {
      process.env.REDIS_HOST = 'redis://redis:6379';
      process.env.REDIS_PORT = '6379';
      process.env.REDIS_PASSWORD = '';
    });

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisService,
          { provide: 'IDebugService', useClass: DebugService },
          { provide: 'IConfigurationService', useClass: ConfigurationService },
          {
            provide: 'IValidatorRegexpService',
            useClass: ValidatorRegexpService,
          },
          { provide: 'IStringExService', useClass: StringExService },
        ],
      }).compile();

      service = module.get<RedisService>(RedisService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('Test - Keys type String', () => {
      it('should be store key', async () => {
        await expect(service.save('Testing_1', 'Niro Health')).resolves.toBe(
          true,
        );
      });

      it('should be get key in store', async () => {
        await expect(service.findOne('Testing_1')).resolves.toBe('Niro Health');
      });

      it('should be find all values in store', async () => {
        await expect(service.findAll()).resolves.toStrictEqual(['Niro Health']);
      });

      it('should be update value in store', async () => {
        await expect(
          service.update('Testing_1', 'GuilhermeSantos001'),
        ).resolves.toBe(true);
        await expect(service.findOne('Testing_1')).resolves.toBe(
          'GuilhermeSantos001',
        );
      });

      it('should be delete value in store', async () => {
        await expect(service.delete('Testing_1')).resolves.toBe(true);
        await expect(service.findAll()).resolves.toStrictEqual([]);
      });
    });

    describe('Test - Keys type Buffer', () => {
      it('should be store key', async () => {
        await expect(
          service.saveBuffer('Testing_2', Buffer.from('Niro Health')),
        ).resolves.toBe(true);
      });

      it('should be get key in store', async () => {
        const buffer = (await service.findOne('Testing_2')) as Buffer;
        expect(buffer.toString()).toBe(Buffer.from('Niro Health').toString());
      });

      it('should be find all values in store', async () => {
        await expect(service.findAll()).resolves.toStrictEqual([
          Buffer.from('Niro Health'),
        ]);
      });

      it('should be update value in store', async () => {
        await expect(
          service.updateBuffer('Testing_2', Buffer.from('GuilhermeSantos001')),
        ).resolves.toBe(true);
        const buffer = (await service.findOne('Testing_2')) as Buffer;
        expect(buffer.toString()).toBe(
          Buffer.from('GuilhermeSantos001').toString(),
        );
      });

      it('should be delete value in store', async () => {
        await expect(service.delete('Testing_2')).resolves.toBe(true);
        await expect(service.findAll()).resolves.toStrictEqual([]);
      });
    });
  });

  describe('Test - Environment variables falsy', () => {
    let service: RedisService;

    beforeAll(() => {
      delete process.env.REDIS_HOST;
      delete process.env.REDIS_PORT;
      delete process.env.REDIS_PASSWORD;
    });

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisService,
          {
            provide: 'IDebugService',
            useClass: DebugService,
          },
          { provide: 'IConfigurationService', useClass: ConfigurationService },
          {
            provide: 'IValidatorRegexpService',
            useClass: ValidatorRegexpService,
          },
          { provide: 'IStringExService', useClass: StringExService },
        ],
      }).compile();

      service = module.get<RedisService>(RedisService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should be could not connect to redis', async () => {
      expect(service.redisConfigurationFalsy).toBe(true);
    });
  });
});
