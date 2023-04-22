import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import { AwsS3Service } from './aws-s3.service';
import { AwsCoreService } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

jest.mock('aws-sdk', () => jest.requireActual('@test/mocks/aws-sdk'));

describe('AwsS3Service', () => {
  let service: AwsS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3Service,
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

    service = module.get<AwsS3Service>(AwsS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload file', async () => {
    await expect(
      service.upload(
        {
          originalname: '???',
          filename: 'testing.txt',
          fieldname: 'file',
          size: 123,
          path: '???',
          stream: new Readable(),
          buffer: Buffer.from('???'),
          destination: '???',
          mimetype: 'txt',
          encoding: '???',
        },
        'testing.txt',
        'txt',
        1,
        '???',
        '???',
      ),
    ).resolves.toEqual('???');
  });

  it('should get file', async () => {
    await expect(service.get('testing.txt', 'txt', 1, '???')).resolves.toEqual({
      $response: { error: false },
    });
  });

  it('should delete file', async () => {
    await expect(service.delete('testing.txt', 'txt', 1, '???')).resolves.toBe(
      true,
    );
  });
});
