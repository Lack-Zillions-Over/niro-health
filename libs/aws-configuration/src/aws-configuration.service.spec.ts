import { Test, TestingModule } from '@nestjs/testing';
import { AwsConfigurationService } from './aws-configuration.service';
import { ConfigurationModule } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';

describe('AwsConfigurationService', () => {
  let service: AwsConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule],
      providers: [AwsConfigurationService, ValidatorRegexpService],
    }).compile();

    service = module.get<AwsConfigurationService>(AwsConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get options', () => {
    expect(service.options).toBeDefined();
  });

  it('should be verify if accessKeyId is defined', () => {
    expect(service.credentials.accessKeyId).toBeDefined();
  });

  it('should be verify if secretAccessKey is defined', () => {
    expect(service.credentials.secretAccessKey).toBeDefined();
  });

  it('should be set apiVersion with valid pattern', () => {
    service.apiVersion = '2026-01-05';
    expect(service.apiVersion).toBeDefined();
  });

  it('should not be set apiVersion with invalid pattern', () => {
    const t = () => {
      service.apiVersion = '20-01-05';
    };

    expect(t).toThrowError(
      `Sorry but the value \"20-01-05\" is not valid. Please use the pattern \"2006-03-01\"`,
    );
  });

  it('should be set region with valid pattern', () => {
    service.region = 'us-east-1';
    expect(service.region).toBeDefined();
  });

  it('should not be set region with invalid pattern', () => {
    const t = () => {
      service.region = 'us-eas';
    };

    expect(t).toThrowError(
      `Sorry but the value \"us-eas\" is not valid. Please use the pattern \"us-east-1\"`,
    );
  });

  it('should be set httpOptions', () => {
    service.httpOptions = {};
    expect(service.httpOptions).toBeDefined();
  });

  it('should be set credentials', () => {
    service.credentials = {
      accessKeyId: '???',
      secretAccessKey: '???',
    };
    expect(service.credentials).toBeDefined();
  });
});
