import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { DebugModule } from '@app/debug';
import { ValidatorRegexpModule } from '@app/validator-regexp';
import { StringExModule } from '@app/string-ex';

@Module({
  imports: [DebugModule, ValidatorRegexpModule, StringExModule],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
