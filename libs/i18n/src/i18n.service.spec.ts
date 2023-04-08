import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule } from '@app/redis';
import { PropStringModule } from '@app/prop-string';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule, PropStringModule],
      providers: [I18nService],
    }).compile();

    service = module.get<I18nService>(I18nService);
    service.setPath('mocks/locales');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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
    await expect(service.translate('txt', 'John')).resolves.toBe('Hello John');
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
      await expect(service.translate('hi', 'GuilhermeSantos001')).resolves.toBe(
        'Hello GuilhermeSantos001',
      );
    });

    it('should not be define a property in a not exist locale', async () => {
      await expect(
        service.defineProperty('fr', { hi: 'Hello $1' }),
      ).rejects.toThrow('Locale fr not found!');
    });
  });
});
