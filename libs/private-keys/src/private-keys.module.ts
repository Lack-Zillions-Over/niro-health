import { Module } from '@nestjs/common';

import { PrivateKeysService } from './private-keys.service';
import { PrivateKeysController } from './private-keys.controller';
import { PrivateKeysParser } from './parsers';

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

@Module({
  controllers: [PrivateKeysController],
  providers: [
    { provide: 'IPrivateKeysService', useClass: PrivateKeysService },
    { provide: 'IPrivateKeysParser', useClass: PrivateKeysParser },
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IRandomService', useClass: RandomService },
    { provide: 'ICryptoService', useClass: CryptoService },
    { provide: 'IJsonWebTokenService', useClass: JsonWebTokenService },
    { provide: 'ISimilarityFilterService', useClass: SimilarityFilterService },
    { provide: 'IRedisService', useClass: RedisService },
    { provide: 'ISqliteService', useClass: SqliteService },
    { provide: 'IPrismaService', useClass: PrismaService },
  ],
  exports: [{ provide: 'IPrivateKeysService', useClass: PrivateKeysService }],
})
export class PrivateKeysModule {}
