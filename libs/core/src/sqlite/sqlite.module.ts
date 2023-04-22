import { Global, Module } from '@nestjs/common';
import { SqliteService } from '@app/core/sqlite/sqlite.service';

import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Global()
@Module({
  providers: [
    SqliteService,
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [SqliteService],
})
export class SqliteModule {}
