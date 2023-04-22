import { Test, TestingModule } from '@nestjs/testing';
import { MockRole3rdParty } from '@test/mocks/aws-sdk';
import { AwsStsService } from './aws-sts.service';
import { AwsConfigurationService } from '@app/aws-configuration';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

jest.mock('aws-sdk', () => jest.requireActual('@test/mocks/aws-sdk'));

describe('AwsStsService', () => {
  let service: AwsStsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsStsService,
        {
          provide: 'IAwsConfigurationService',
          useClass: AwsConfigurationService,
        },
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
      ],
    }).compile();

    service = module.get<AwsStsService>(AwsStsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be save role', async () => {
    await expect(service.saveRole(MockRole3rdParty)).resolves.toBeUndefined();
  });

  it('should not be run method assumeRole', async () => {
    await expect(service.assumeRole()).resolves.toThrowError(
      'Role3rdParty not defined',
    );
  });

  it('should be run method assumeRole', async () => {
    await expect(service.saveRole(MockRole3rdParty)).resolves.toBeUndefined();
    const role = await service.assumeRole();
    expect(role).not.toBeNull();
  });
});
