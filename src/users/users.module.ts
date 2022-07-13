import { Module } from '@nestjs/common';

import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';
import { UsersParser } from '@/users/parsers/users.parser';
import { SessionParser } from '@/users/parsers/session.parser';
import { LocaleModule } from '@/core/i18n/i18n.module';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [LocaleModule, CoreModule],
  controllers: [UsersController],
  providers: [UsersService, UsersParser, SessionParser],
  exports: [UsersService],
})
export class UsersModule {}
