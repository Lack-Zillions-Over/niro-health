import { Test, TestingModule } from '@nestjs/testing';
import { RandomStringService } from '@app/random/random-string.service';
import { StringExService } from '@app/string-ex/string-ex.service';
import { ValidateUUID } from '@app/string-ex/validators/uuid.validator';

describe('RandomStringService', () => {
  let service: RandomStringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomStringService, StringExService],
    }).compile();

    service = module.get<RandomStringService>(RandomStringService);
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
    expect(uuid).toHaveLength(36);
    expect(ValidateUUID(uuid)).toBe(true);
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
