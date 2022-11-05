import { Logger } from '@nestjs/common';
import { Process, Processor, OnQueueError } from '@nestjs/bull';
import { Job } from 'bull';

import EmailNameJob from '@/users/jobs/constants/email/emailNameJob';
import AccountActivateProcess from '@/users/jobs/constants/email/accountActivateProcess';
import { AccountActivateType } from '@/users/jobs/types/email/accountActivate';

import { EmailSend } from '@/core/utils/emailSend';

@Processor(EmailNameJob)
export class EmailJob {
  private readonly logger = new Logger(EmailJob.name);
  private readonly emailSend = new EmailSend();

  @OnQueueError()
  onError(err: Error) {
    throw new Error(`Queue error: ${err.message}`);
  }

  @Process(AccountActivateProcess)
  async handleAccountActivate(job: Job<AccountActivateType>) {
    this.logger.debug(
      `Email for activation of account(${job.data.username}) sent...`,
    );

    return await this.emailSend.accountEmailConfirm(
      job.data.email,
      job.data.username,
      job.data.token,
      job.data.temporarypass,
    );
  }
}
