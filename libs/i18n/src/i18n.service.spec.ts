import { Test, TestingModule } from '@nestjs/testing';
import { i18nService } from './i18n.service';
import { RedisService } from '@app/core/redis/redis.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { PropStringService } from '@app/prop-string';

jest.mock('ioredis', () => jest.requireActual('@test/mocks/ioredis'));

describe('I18nService', () => {
  let service: i18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        i18nService,
        { provide: 'IRedisService', useClass: RedisService },
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        { provide: 'IPropStringService', useClass: PropStringService },
      ],
    }).compile();

    service = module.get<i18nService>(i18nService);
    await service.resetLocales();
    service.setPath('mocks/locales');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Testing with driver - FS', () => {
    it('should be define path folder for locales files', () => {
      expect(service.setPath('test/locales')).toBe(undefined);
    });

    it('should be define driver used for store data', () => {
      expect(service.setDriver('fs')).toBe(undefined);
    });

    it('should be returns the path folder for locales files', () => {
      expect(service.getPath().match(/(test|locales)/g).length).toBeGreaterThan(
        0,
      );
    });

    it('should be returns the driver used for store data', () => {
      expect(service.getDriver()).toBe('fs');
    });

    it('should be get the current locale', () => {
      expect(service.getLocale()).toBe('en');
    });

    it('should be get all locales', () => {
      expect(service.getLocales()).toStrictEqual(['en']);
    });

    it('should be translate a phrase in the current locale', async () => {
      const text = await service.translate('hello', 'GuilhermeSantos001');
      expect(text).toBe('Hi GuilhermeSantos001');
    });

    it('should be add the current locale', async () => {
      const text = 'Niro Health is cool!!!';
      await expect(service.addLocale('pt-br')).resolves.not.toThrow();
      await expect(
        service.defineProperty('pt-br', {
          'ola-mundo': `Hey $1 - ${text}`,
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('ola-mundo', 'Sir')).resolves.toBe(
        `Hey Sir - ${text}`,
      );
    });

    it('should be set the current locale', async () => {
      await expect(service.defineLocale('en')).resolves.not.toThrow();
      await expect(
        service.defineProperty('en', {
          txt: 'Hello $1',
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('txt', 'John')).resolves.toBe(
        'Hello John',
      );
    });

    it('should be reset all locales', async () => {
      await expect(
        service.defineProperty('en', {
          say: '$1',
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Niro Health',
      );
      await expect(service.resetLocales()).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Phrase "say" not found in locale.',
      );
    });

    it('should be remove a property in a locale', async () => {
      await expect(
        service.defineProperty('en', {
          say: '$1',
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Niro Health',
      );
      await expect(service.removeProperty('en', 'say')).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Phrase "say" not found in locale.',
      );
    });

    describe('Testing define property', () => {
      it('should be define a property in a locale', async () => {
        await expect(
          service.defineProperty('en', { hi: 'Hello $1' }),
        ).resolves.not.toThrow();
        await expect(
          service.translate('hi', 'GuilhermeSantos001'),
        ).resolves.toBe('Hello GuilhermeSantos001');
      });

      it('should be define a property in a way nested', async () => {
        await expect(
          service.defineProperty('en', { message: '$1', info: 'Hello World' }),
        ).resolves.not.toThrow();
        await expect(service.translate('message', '.info')).resolves.toBe(
          'Hello World',
        );
      });

      it('should not be define a property in a not exist locale', async () => {
        await expect(
          service.defineProperty('fr', { hi: 'Hello $1' }),
        ).rejects.toThrow('Locale fr not found!');
      });
    });
  });

  describe('Testing with driver - Redis', () => {
    it('should be define driver used for store data', () => {
      expect(service.setDriver('redis')).toBeUndefined();
    });

    it('should be returns the driver used for store data', () => {
      expect(service.getDriver()).toBe('redis');
    });

    it('should be get the current locale', () => {
      expect(service.getLocale()).toBe('en');
    });

    it('should be get all locales', () => {
      expect(service.getLocales()).toStrictEqual(['en', 'pt-br']);
    });

    it('should be translate a phrase in the current locale', async () => {
      const text = await service.translate('hello', 'GuilhermeSantos001');
      expect(text).toBe('Hi GuilhermeSantos001');
    });

    it('should be add the current locale', async () => {
      const text = 'Niro Health is cool!!!';
      await expect(service.addLocale('pt-br')).resolves.not.toThrow();
      await expect(
        service.defineProperty('pt-br', {
          'ola-mundo': `Hey $1 - ${text}`,
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('ola-mundo', 'Sir')).resolves.toBe(
        `Hey Sir - ${text}`,
      );
    });

    it('should be set the current locale', async () => {
      await expect(service.defineLocale('en')).resolves.not.toThrow();
      await expect(
        service.defineProperty('en', {
          txt: 'Hello $1',
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('txt', 'John')).resolves.toBe(
        'Hello John',
      );
    });

    it('should be reset all locales', async () => {
      await expect(
        service.defineProperty('en', {
          say: '$1',
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Niro Health',
      );
      await expect(service.resetLocales()).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Phrase "say" not found in locale.',
      );
    });

    it('should be remove a property in a locale', async () => {
      await expect(
        service.defineProperty('en', {
          say: '$1',
        }),
      ).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Niro Health',
      );
      await expect(service.removeProperty('en', 'say')).resolves.not.toThrow();
      await expect(service.translate('say', 'Niro Health')).resolves.toBe(
        'Phrase "say" not found in locale.',
      );
    });

    describe('Testing define property', () => {
      it('should be define a property in a locale', async () => {
        await expect(
          service.defineProperty('en', { hi: 'Hello $1' }),
        ).resolves.not.toThrow();
        await expect(
          service.translate('hi', 'GuilhermeSantos001'),
        ).resolves.toBe('Hello GuilhermeSantos001');
      });

      it('should be define a property in a way nested', async () => {
        await expect(
          service.defineProperty('en', { message: '$1', info: 'Hello World' }),
        ).resolves.not.toThrow();
        await expect(service.translate('message', '.info')).resolves.toBe(
          'Hello World',
        );
      });

      it('should not be define a property in a not exist locale', async () => {
        await expect(
          service.defineProperty('fr', { hi: 'Hello $1' }),
        ).rejects.toThrow('Locale fr not found!');
      });
    });
  });
});
