import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { AwsCoreModule } from '@app/aws-core';
import { ConfigurationService } from '@app/configuration';
import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Module({
  imports: [AwsCoreModule],
  providers: [
    EmailService,
    ConfigurationService,
    DebugService,
    ValidatorRegexpService,
    StringExService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
