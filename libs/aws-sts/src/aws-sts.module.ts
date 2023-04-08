import { Module } from '@nestjs/common';
import { AwsStsService } from './aws-sts.service';
import { AwsConfigurationService } from '@app/aws-configuration';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { DebugService } from '@app/debug';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    AwsStsService,
    AwsConfigurationService,
    ConfigurationService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
  exports: [AwsStsService],
})
export class AwsStsModule {}
