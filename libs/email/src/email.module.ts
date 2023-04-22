import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AwsCoreService } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

@Module({
  providers: [
    EmailService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IAwsCoreService', useClass: AwsCoreService },
    { provide: 'IAwsConfigurationService', useClass: AwsConfigurationService },
    { provide: 'IAwsStsService', useClass: AwsStsService },
  ],
  exports: [EmailService],
})
export class EmailModule {}
