import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FilesParser } from './parsers';
import { AppHostService } from '@app/app-host';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { i18nService } from '@app/i18n';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { PropStringService } from '@app/prop-string';
import { RandomService } from '@app/random';
import { CryptoService } from '@app/crypto';
import { JsonWebTokenService } from '@app/json-web-token';
import { LocalPathService } from '@app/localpath';
import { SimilarityFilterService } from '@app/similarity-filter';
import { AwsS3Service } from '@app/aws-s3';
import { AwsCoreService } from '@app/aws-core';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';
import { FileGridfsService } from '@app/file-gridfs';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';
import { RedisService } from '@app/core/redis/redis.service';
import { SqliteService } from '@app/core/sqlite/sqlite.service';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { ArchiveService } from '@app/archive';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppHostService,
        { provide: 'IFilesService', useClass: FilesService },
        { provide: 'IFilesParser', useClass: FilesParser },
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        { provide: 'IDebugService', useClass: DebugService },
        { provide: 'Ii18nService', useClass: i18nService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        { provide: 'IPropStringService', useClass: PropStringService },
        { provide: 'IRandomService', useClass: RandomService },
        { provide: 'ICryptoService', useClass: CryptoService },
        { provide: 'IJsonWebTokenService', useClass: JsonWebTokenService },
        { provide: 'ILocalPathService', useClass: LocalPathService },
        {
          provide: 'ISimilarityFilterService',
          useClass: SimilarityFilterService,
        },
        { provide: 'IAwsS3Service', useClass: AwsS3Service },
        { provide: 'IAwsCoreService', useClass: AwsCoreService },
        {
          provide: 'IAwsConfigurationService',
          useClass: AwsConfigurationService,
        },
        { provide: 'IAwsStsService', useClass: AwsStsService },
        { provide: 'IArchiveService', useClass: ArchiveService },
        { provide: 'IFileGridfsService', useClass: FileGridfsService },
        { provide: 'IMongoDBService', useClass: MongoDBService },
        { provide: 'IRedisService', useClass: RedisService },
        { provide: 'ISqliteService', useClass: SqliteService },
        { provide: 'IPrismaService', useClass: PrismaService },
      ],
    }).compile();

    service = module.get<FilesService>('IFilesService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
