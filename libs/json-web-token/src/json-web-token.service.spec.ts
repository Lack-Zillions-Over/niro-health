import { Test, TestingModule } from '@nestjs/testing';
import { JsonWebTokenService } from './json-web-token.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

describe('JsonWebTokenService', () => {
  let service: JsonWebTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JsonWebTokenService,
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
      ],
    }).compile();

    service = module.get<JsonWebTokenService>(JsonWebTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be generate token', () => {
    expect(
      service.save({ username: 'GuilhermeSantos001' }, 'shhhh', '60s'),
    ).not.toBeInstanceOf(Error);
  });

  it('should be get payload from token', () => {
    const json = { username: 'GuilhermeSantos001' };
    const token = service.save(json, 'shhhh', '60s') as string;
    const payload = service.load(token, 'shhhh');
    expect(payload).not.toBeInstanceOf(Error);
    expect(payload).toMatchObject(json);
  });
});
