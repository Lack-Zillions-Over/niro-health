import { Global, Module } from '@nestjs/common';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';
import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Global()
@Module({
  providers: [
    MongoDBService,
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
  ],
  exports: [MongoDBService],
})
export class MongoDBModule {}
