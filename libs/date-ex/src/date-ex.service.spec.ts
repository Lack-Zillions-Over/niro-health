import { Test, TestingModule } from '@nestjs/testing';
import { DateExService } from './date-ex.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

describe('DateExService', () => {
  let service: DateExService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DateExService,
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
      ],
    }).compile();

    service = module.get<DateExService>(DateExService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be instance defined', () => {
    expect(service.moment()).toBeDefined();
  });

  it('should check if format return correct value', () => {
    const result = service.moment().format('YYYY-MM-DD');
    const split = result.toString().split('-');
    expect(split[0].length).toBe(4);
    expect(split[1].length).toBe(2);
    expect(split[2].length).toBe(2);
    expect(result).toBe(`${split[0]}-${split[1]}-${split[2]}`);
  });

  it('should get now', () => {
    expect(service.now).toBeDefined();
    expect(service.now).toBeInstanceOf(Date);
  });

  it('should get utc', () => {
    expect(service.utc).toBeDefined();
    expect(service.utc).toBeInstanceOf(Date);
  });

  it('should return date subtracting seven days', () => {
    const now = new Date();
    now.setDate(now.getDate() - 7);
    expect(service.sevenDaysAgo).toBeDefined();
    expect(service.sevenDaysAgo).toBeInstanceOf(Date);
    expect(service.sevenDaysAgo.toLocaleDateString()).toStrictEqual(
      now.toLocaleDateString(),
    );
  });

  it('should return date adding seven days', () => {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    expect(service.sevenDaysFromNow).toBeDefined();
    expect(service.sevenDaysFromNow).toBeInstanceOf(Date);
    expect(service.sevenDaysFromNow.toLocaleDateString()).toStrictEqual(
      now.toLocaleDateString(),
    );
  });

  it('should return date subtracting one month', () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    expect(service.oneMonthAgo).toBeDefined();
    expect(service.oneMonthAgo).toBeInstanceOf(Date);
    expect(service.oneMonthAgo.toLocaleDateString()).toStrictEqual(
      now.toLocaleDateString(),
    );
  });

  it('should return date adding one month', () => {
    const now = new Date();
    now.setMonth(now.getMonth() + 1);
    expect(service.oneMonthFromNow).toBeDefined();
    expect(service.oneMonthFromNow).toBeInstanceOf(Date);
    expect(service.oneMonthFromNow.toLocaleDateString()).toStrictEqual(
      now.toLocaleDateString(),
    );
  });

  it('should return date subtracting one year', () => {
    const now = new Date();
    now.setFullYear(now.getFullYear() - 1);
    expect(service.oneYearAgo).toBeDefined();
    expect(service.oneYearAgo).toBeInstanceOf(Date);
    expect(service.oneYearAgo.toLocaleDateString()).toStrictEqual(
      now.toLocaleDateString(),
    );
  });

  it('should return date adding one year', () => {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    expect(service.oneYearFromNow).toBeDefined();
    expect(service.oneYearFromNow).toBeInstanceOf(Date);
    expect(service.oneYearFromNow.toLocaleDateString()).toStrictEqual(
      now.toLocaleDateString(),
    );
  });
});
