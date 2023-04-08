import { Test, TestingModule } from '@nestjs/testing';
import { AwsCoreService } from './aws-core.service';
import { AwsConfigurationModule } from '@app/aws-configuration';
import { AwsStsModule } from '@app/aws-sts';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { MockRole3rdParty } from '@test/mocks/aws-sdk';

jest.mock('aws-sdk', () => jest.requireActual('@test/mocks/aws-sdk'));

describe('AwsCoreService', () => {
  let service: AwsCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsConfigurationModule, AwsStsModule],
      providers: [
        AwsCoreService,
        ConfigurationService,
        DebugService,
        ValidatorRegexpService,
        StringExService,
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
