import { Module } from '@nestjs/common';
import { AwsConfigurationService } from './aws-configuration.service';
import { ConfigurationModule } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';

@Module({
  imports: [ConfigurationModule],
  providers: [AwsConfigurationService, ValidatorRegexpService],
  exports: [AwsConfigurationService],
})
export class AwsConfigurationModule {}
