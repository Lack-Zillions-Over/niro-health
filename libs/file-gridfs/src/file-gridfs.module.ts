import { Module } from '@nestjs/common';
import { FileGridfsService } from './file-gridfs.service';
import { ConfigurationService } from '@app/configuration';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  providers: [
    FileGridfsService,
    ConfigurationService,
    MongoDBService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
  exports: [FileGridfsService],
})
export class FileGridfsModule {}
