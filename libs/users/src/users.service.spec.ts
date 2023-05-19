import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersParser } from './parsers';
import { EmailJob } from './jobs/email';
import { AppHostService } from '@app/app-host';
import { CoreModule } from '@app/core';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { RandomService } from '@app/random';
import { CryptoService } from '@app/crypto';
import { JsonWebTokenService } from '@app/json-web-token';
import { SimilarityFilterService } from '@app/similarity-filter';
import { EmailService } from '@app/email';
import { AwsCoreService } from '@app/aws-core';
import { AwsConfigurationService } from '@app/aws-configuration';
import { AwsStsService } from '@app/aws-sts';
import { SqliteService } from '@app/core/sqlite/sqlite.service';
import { RedisService } from '@app/core/redis/redis.service';
import { PrismaService } from '@app/core/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
      providers: [
        {
          provide: 'IAppHostService',
          useClass: AppHostService,
        },
        { provide: 'IUsersService', useClass: UsersService },
        { provide: 'IUsersParser', useClass: UsersParser },
        { provide: 'IEmailJob', useClass: EmailJob },
        { provide: 'IConfigurationService', useClass: ConfigurationService },
        { provide: 'IDebugService', useClass: DebugService },
        {
          provide: 'IValidatorRegexpService',
          useClass: ValidatorRegexpService,
        },
        { provide: 'IStringExService', useClass: StringExService },
        { provide: 'IRandomService', useClass: RandomService },
        { provide: 'ICryptoService', useClass: CryptoService },
        { provide: 'IJsonWebTokenService', useClass: JsonWebTokenService },
        {
          provide: 'ISimilarityFilterService',
          useClass: SimilarityFilterService,
        },
        { provide: 'IEmailService', useClass: EmailService },
        { provide: 'IAwsCoreService', useClass: AwsCoreService },
        {
          provide: 'IAwsConfigurationService',
          useClass: AwsConfigurationService,
        },
        { provide: 'IAwsStsService', useClass: AwsStsService },
        { provide: 'IRedisService', useClass: RedisService },
        { provide: 'ISqliteService', useClass: SqliteService },
        { provide: 'IPrismaService', useClass: PrismaService },
      ],
    }).compile();

    service = module.get<UsersService>('IUsersService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
