import { Test, TestingModule } from '@nestjs/testing';
import { AwsEc2Service } from './aws-ec2.service';
import { AwsCoreService } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

jest.mock('aws-sdk', () => jest.requireActual('@test/mocks/aws-sdk'));

describe('AwsEc2Service', () => {
  let service: AwsEc2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsEc2Service,
        { provide: 'IAwsCoreService', useClass: AwsCoreService },
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

    service = module.get<AwsEc2Service>(AwsEc2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create key pair', async () => {
    await expect(service.createKeyPair('testing')).resolves.toEqual({
      id: '???',
      key: '???',
    });
  });

  it('should describe key pair', async () => {
    await expect(service.describeKeyPair('testing')).resolves.toEqual([]);
  });

  it('should delete key pair', async () => {
    await expect(service.deleteKeyPair('testing')).resolves.toEqual(true);
  });

  it('should create instance', async () => {
    await expect(
      service.createInstance('ami-0c2b8ca1dad447f8a', 't2.micro', 'testing'),
    ).resolves.toEqual([]);
  });

  it('should describe instance', async () => {
    await expect(
      service.describeInstance('i-0c2b8ca1dad447f8a'),
    ).resolves.toEqual([]);
  });

  it('should terminate instance', async () => {
    await expect(
      service.terminateInstance('i-0c2b8ca1dad447f8a', 'testing'),
    ).resolves.toEqual(false);
  });
});
