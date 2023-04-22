import { Module } from '@nestjs/common';
import { AwsEc2Service } from './aws-ec2.service';
import { AwsCoreService } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

@Module({
  providers: [
    AwsEc2Service,
    { provide: 'IAwsCoreService', useClass: AwsCoreService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IAwsConfigurationService', useClass: AwsConfigurationService },
    { provide: 'IAwsStsService', useClass: AwsStsService },
  ],
  exports: [AwsEc2Service],
})
export class AwsEc2Module {}
