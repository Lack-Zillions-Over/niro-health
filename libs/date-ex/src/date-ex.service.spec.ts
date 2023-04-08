import { Test, TestingModule } from '@nestjs/testing';
import { DateExService } from './date-ex.service';
import { ValidatorRegexpService } from '@app/validator-regexp';

describe('DateExService', () => {
  let service: DateExService;
  let validatorRegExpService: ValidatorRegexpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DateExService, ValidatorRegexpService],
    }).compile();

    service = module.get<DateExService>(DateExService);
    validatorRegExpService = module.get<ValidatorRegexpService>(
      ValidatorRegexpService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be instance defined', () => {
    expect(service.instance()).toBeDefined();
  });

  it('should check if format return correct value', () => {
    const result = service.format({
      layout: 'YYYY-MM-DD',
    });
    const split = result.split('-');
    expect(split[0].length).toBe(4);
    expect(split[1].length).toBe(2);
    expect(split[2].length).toBe(2);
  });

  it('should format date to layout', () => {
    const result = service.formatDate(new Date().toISOString());
    expect(
      validatorRegExpService.date(result.toISOString()).iso(),
    ).toBeUndefined();
  });
});
