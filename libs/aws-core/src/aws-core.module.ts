import { Module } from '@nestjs/common';
import { AwsCoreService } from './aws-core.service';
import { AwsConfigurationModule } from '@app/aws-configuration';
import { AwsStsModule } from '@app/aws-sts';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  imports: [AwsConfigurationModule, AwsStsModule],
  providers: [
    AwsCoreService,
    ConfigurationService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
  exports: [AwsCoreService],
})
export class AwsCoreModule {}
