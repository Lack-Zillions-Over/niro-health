import { Module } from '@nestjs/common';

import { CoreService } from '@/core/core.service';
import { CoreController } from '@/core/core.controller';
import { PrivateKeysParser } from '@/core/parsers/private-keys.parser';
import { LocaleModule } from '@/core/i18n/i18n.module';

@Module({
  imports: [LocaleModule],
  controllers: [CoreController],
  providers: [CoreService, PrivateKeysParser],
  exports: [CoreService],
})
export class CoreModule {}
