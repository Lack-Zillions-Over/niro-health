import { Module } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { RedisService } from '@app/redis';
import { PropStringService } from '@app/prop-string';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    I18nService,
    ConfigurationService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
    RedisService,
    PropStringService,
  ],
  exports: [I18nService],
})
export class I18nModule {}
