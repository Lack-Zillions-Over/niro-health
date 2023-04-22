import { Module } from '@nestjs/common';
import { FileGridfsService } from './file-gridfs.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';
import { DebugService } from '@app/debug';

@Module({
  providers: [
    FileGridfsService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IMongoDBService', useClass: MongoDBService },
    { provide: 'IDebugService', useClass: DebugService },
  ],
  exports: [FileGridfsService],
})
export class FileGridfsModule {}
