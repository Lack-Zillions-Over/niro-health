import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';

import { CoreModule } from '@/core/core.module';

import { EmailJob } from '@/users/jobs/email';
import EmailNameJob from '@/users/jobs/constants/email/emailNameJob';

import { UsersService } from '@/users/users.service';
import { UsersController } from '@/users/users.controller';
import { UsersParser } from '@/users/parsers';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EmailNameJob,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CoreModule,
  ],
  controllers: [UsersController],
  providers: [EmailJob, UsersService, UsersParser],
  exports: [UsersService],
})
export class UsersModule {}
