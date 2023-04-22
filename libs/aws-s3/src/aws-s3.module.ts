import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsCoreService } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

@Module({
  providers: [
    AwsS3Service,
    { provide: 'IAwsCoreService', useClass: AwsCoreService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IAwsConfigurationService', useClass: AwsConfigurationService },
    { provide: 'IAwsStsService', useClass: AwsStsService },
  ],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
