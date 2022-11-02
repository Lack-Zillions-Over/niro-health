import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';
import { PrivateKeysController } from '@/privateKeys/privateKeys.controller';
import { PrivateKeysService } from '@/privateKeys/privateKeys.service';
import { PrivateKeysParser } from '@/privateKeys/parsers';

@Module({
  imports: [CoreModule],
  controllers: [PrivateKeysController],
  providers: [PrivateKeysService, PrivateKeysParser],
  exports: [PrivateKeysService],
})
export class PrivateKeysModule {}
