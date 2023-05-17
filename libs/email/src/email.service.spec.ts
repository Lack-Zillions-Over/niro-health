import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { AwsCoreService } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

jest.mock('nodemailer', () => jest.requireActual('@test/mocks/nodemailer'));

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        { provide: 'IAwsCoreService', useClass: AwsCoreService },
        {
          provide: 'IAwsConfigurationService',
          useClass: AwsConfigurationService,
        },
        { provide: 'IAwsStsService', useClass: AwsStsService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined PATHTEMPLATES', () => {
    expect(service.pathTemplates).toBeDefined();
  });

  it('should be defined STRATEGY', () => {
    expect(service.strategy).toBeDefined();
  });

  it('should be defined FROM', () => {
    expect(service.from).toBeDefined();
  });

  it('should be defined PRIORITY', () => {
    expect(service.priority).toBeDefined();
  });

  it('should be defined CC', () => {
    expect(service.cc instanceof Array).not.toBeFalsy();
  });

  it('should be defined CCO', () => {
    expect(service.cco instanceof Array).not.toBeFalsy();
  });

  it('should reset CC', () => {
    service.cc = ['testing@niro-health.com', 'support@niro-health.com'];
    expect(service.cc).toHaveLength(2);
    service.resetCC();
    expect(service.cc).toHaveLength(0);
  });

  it('should reset CCO', () => {
    service.cco = ['testing@niro-health.com', 'support@niro-health.com'];
    expect(service.cco).toHaveLength(2);
    service.resetCCO();
    expect(service.cco).toHaveLength(0);
  });

  describe('Tests send mail', () => {
    it('should be run method send', async () => {
      const result = await service.send(
        {
          subject: 'Testing application',
          to: ['niro@health.com'],
        },
        'email-test',
        {
          title: 'Hello World',
          variables: {},
        },
      );

      expect(result).toBeDefined();
    });

    it('should be run method test', async () => {
      const result = await service.test(
        {
          subject: 'Testing application',
          to: ['niro@health.com'],
        },
        'email-test',
      );

      expect(result).toBeDefined();
    });
  });
});
