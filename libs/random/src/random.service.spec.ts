import { Test, TestingModule } from '@nestjs/testing';
import { RandomStringService } from '@app/random';
import { StringExService } from '@app/string-ex/string-ex.service';
import { ValidatorRegexpService } from '@app/validator-regexp';

describe('RandomStringService', () => {
  let service: RandomStringService;
  let validatorRegexpService: ValidatorRegexpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomStringService, StringExService, ValidatorRegexpService],
    }).compile();

    service = module.get<RandomStringService>(RandomStringService);
    validatorRegexpService = module.get<ValidatorRegexpService>(
      ValidatorRegexpService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be returns a random integer between min and max', () => {
    const integer = service.int(100);
    expect(typeof integer).toBe('number');
  });

  it('should be returns a random string of characters', () => {
    const text = service.string(100);
    expect(text).toHaveLength(100);
    expect(typeof text).toBe('string');
  });

  it('should be returns a random password', () => {
    const password = service.password(100);
    expect(password).toHaveLength(100);
    expect(typeof password).toBe('string');
  });

  it('should be returns a random string format of UUID', () => {
    const uuid = service.uuid();
    const check = () => validatorRegexpService.string(uuid).uuid();
    expect(uuid).toHaveLength(36);
    expect(check).not.toThrow();
  });

  describe('Tests with hash', () => {
    it('should be returns a random string format of HAS (hex)', () => {
      const hash = service.hash(12, 'hex');
      expect(hash).toHaveLength(32);
    });

    it('should be returns a random string format of HAS (base64)', () => {
      const hash = service.hash(12, 'base64');
      expect(hash).toHaveLength(24);
    });

    it('should be returns a random string format of HAS (base64url)', () => {
      const hash = service.hash(12, 'base64url');
      expect(hash).toHaveLength(22);
    });
  });
});
