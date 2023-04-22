import { Module } from '@nestjs/common';
import { i18nService } from './i18n.service';
import { RedisService } from '@app/core/redis/redis.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { PropStringService } from '@app/prop-string';

@Module({
  providers: [
    i18nService,
    { provide: 'IRedisService', useClass: RedisService },
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IPropStringService', useClass: PropStringService },
  ],
  exports: [i18nService],
})
export class i18nModule {}
