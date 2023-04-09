import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    RedisService,
    ConfigurationService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
