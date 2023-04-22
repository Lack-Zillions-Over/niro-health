import { Test, TestingModule } from '@nestjs/testing';
import { AwsCoreService } from './aws-core.service';
import { MockRole3rdParty } from '@test/mocks/aws-sdk';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

jest.mock('aws-sdk', () => jest.requireActual('@test/mocks/aws-sdk'));

describe('AwsCoreService', () => {
  let service: AwsCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsCoreService,
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        {
          provide: 'IAwsConfigurationService',
          useClass: AwsConfigurationService,
        },
        { provide: 'IAwsStsService', useClass: AwsStsService },
      ],
    }).compile();

    service = module.get<AwsCoreService>(AwsCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get Configuration', async () => {
    await expect(service.configuration()).resolves.not.toBeUndefined();
  });

  it('should set Role 3rd Party', async () => {
    await expect(
      service.setRole3rdParty(MockRole3rdParty),
    ).resolves.toBeUndefined();
  });
});
