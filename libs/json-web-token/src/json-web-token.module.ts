import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    JsonWebTokenService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
  exports: [JsonWebTokenService],
})
export class JsonWebTokenModule {}
