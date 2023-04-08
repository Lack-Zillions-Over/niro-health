import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { AwsCoreModule } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

jest.mock('nodemailer', () => jest.requireActual('@test/mocks/nodemailer'));

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsCoreModule],
      providers: [
        EmailService,
        ConfigurationService,
        DebugService,
        ValidatorRegexpService,
        StringExService,
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
