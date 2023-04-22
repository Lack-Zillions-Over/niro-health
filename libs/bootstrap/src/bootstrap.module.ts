import { Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { ConfigurationService } from '@app/configuration';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';
import { DebugService } from '@app/debug';
import { i18nService } from '@app/i18n';
import { RedisService } from '@app/core/redis/redis.service';
import { PropStringService } from '@app/prop-string';
import { PrismaService } from '@app/core/prisma/prisma.service';
import { MongoDBService } from '@app/core/mongodb/mongodb.service';

@Module({
  providers: [
    BootstrapService,
    { provide: 'IConfigurationService', useClass: ConfigurationService },
    { provide: 'IValidatorRegexpService', useClass: ValidatorRegexpService },
    { provide: 'IStringExService', useClass: StringExService },
    { provide: 'IDebugService', useClass: DebugService },
    { provide: 'Ii18nService', useClass: i18nService },
    { provide: 'IRedisService', useClass: RedisService },
    { provide: 'IPropStringService', useClass: PropStringService },
    { provide: 'IPrismaService', useClass: PrismaService },
    { provide: 'IMongoDBService', useClass: MongoDBService },
  ],
  exports: [BootstrapService],
})
export class BootstrapModule {}
