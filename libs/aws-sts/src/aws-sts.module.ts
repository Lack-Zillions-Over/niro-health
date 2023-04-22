import { Module } from '@nestjs/common';
import { AwsStsService } from './aws-sts.service';
import { AwsConfigurationService } from '@app/aws-configuration';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    AwsStsService,
    { provide: 'IAwsConfigurationService', useClass: AwsConfigurationService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [AwsStsService],
})
export class AwsStsModule {}
