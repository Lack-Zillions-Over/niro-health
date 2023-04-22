import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { RedisService } from '@app/core/redis/redis.service';
import { SqliteService } from '@app/core/sqlite/sqlite.service';
import { DebugService } from '@app/debug';
import { RandomService } from '@app/random';

@Module({
  providers: [
    CryptoService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IRedisService', useClass: RedisService },
    { provide: 'ISqliteService', useClass: SqliteService },
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IRandomService', useClass: RandomService },
  ],
  exports: [CryptoService],
})
export class CryptoModule {}
