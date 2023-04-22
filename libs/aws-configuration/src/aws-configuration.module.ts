import { Module } from '@nestjs/common';
import { AwsConfigurationService } from './aws-configuration.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    AwsConfigurationService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [AwsConfigurationService],
})
export class AwsConfigurationModule {}
