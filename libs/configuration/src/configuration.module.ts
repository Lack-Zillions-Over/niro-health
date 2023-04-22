import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    ConfigurationService,
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
