import { Module } from '@nestjs/common';
import { AwsCoreService } from './aws-core.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';

@Module({
  providers: [
    AwsCoreService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IAwsConfigurationService', useClass: AwsConfigurationService },
    { provide: 'IAwsStsService', useClass: AwsStsService },
  ],
  exports: [AwsCoreService],
})
export class AwsCoreModule {}
