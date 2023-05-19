import { Test, TestingModule } from '@nestjs/testing';
import { PrivateKeysService } from './private-keys.service';
import { PrivateKeysParser } from './parsers';
import { AppHostService } from '@app/app-host';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { RandomService } from '@app/random';
import { CryptoService } from '@app/crypto';
import { JsonWebTokenService } from '@app/json-web-token';
import { SimilarityFilterService } from '@app/similarity-filter';
import { SqliteService } from '@app/core/sqlite/sqlite.service';
import { RedisService } from '@app/core/redis/redis.service';
import { PrismaService } from '@app/core/prisma/prisma.service';

describe('PrivateKeysService', () => {
  let service: PrivateKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'IAppHostService',
          useClass: AppHostService,
        },
        { provide: 'IPrivateKeysService', useClass: PrivateKeysService },
        { provide: 'IPrivateKeysParser', useClass: PrivateKeysParser },
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
        { provide: 'IRedisService', useClass: RedisService },
        { provide: 'ISqliteService', useClass: SqliteService },
        { provide: 'IPrismaService', useClass: PrismaService },
      ],
    }).compile();

    service = module.get<PrivateKeysService>('IPrivateKeysService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
