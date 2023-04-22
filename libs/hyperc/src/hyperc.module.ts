import { Module } from '@nestjs/common';
import { HypercService } from './hyperc.service';
import { RedisService } from '@app/core/redis/redis.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    HypercService,
    { provide: 'IRedisService', useClass: RedisService },
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [HypercService],
})
export class HypercModule {}
