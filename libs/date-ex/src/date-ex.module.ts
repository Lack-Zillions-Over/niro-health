import { Module } from '@nestjs/common';
import { DateExService } from './date-ex.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    DateExService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [DateExService],
})
export class DateExModule {}
