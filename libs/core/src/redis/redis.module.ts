import { Global, Module } from '@nestjs/common';
import { RedisService } from '@app/core/redis/redis.service';

import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Global()
@Module({
  providers: [
    RedisService,
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [RedisService],
})
export class RedisModule {}
