import { Module } from '@nestjs/common';
import { ConfigurationService } from '@app/configuration';
import { SqliteService } from '@app/sqlite';
import { RedisService } from '@app/redis';
import { RandomStringService } from '@app/random';
import { CryptoService } from './crypto.service';

@Module({
  providers: [
    CryptoService,
    ConfigurationService,
    RedisService,
    SqliteService,
    RandomStringService,
  ],
  exports: [CryptoService],
})
export class CryptoModule {}
