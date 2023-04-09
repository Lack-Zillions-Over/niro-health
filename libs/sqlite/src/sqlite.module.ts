import { Module } from '@nestjs/common';
import { ConfigurationService } from '@app/configuration';
import { SqliteService } from './sqlite.service';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    SqliteService,
    ConfigurationService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
  exports: [SqliteService],
})
export class SqliteModule {}
