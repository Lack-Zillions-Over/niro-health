import { Inject, Logger } from '@nestjs/common';
import { Process, Processor, OnQueueError, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';

import SMTPTransport from 'nodemailer/lib/smtp-transport';

import EmailNameJob from '@app/users/jobs/constants/email/emailNameJob';
import AccountActivateProcess from '@app/users/jobs/constants/email/accountActivateProcess';

import type { AccountActivateType } from '@app/users/jobs/types/email/accountActivate';
import type { IConfigurationService } from '@app/configuration';
import type { IEmailService } from '@app/email';

@Processor(EmailNameJob)
export class EmailJob {
  private readonly logger = new Logger(EmailJob.name);

  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IEmailService') private readonly emailService: IEmailService,
  ) {}

  private async _accountEmailConfirm(
    email: string,
    username: string,
    token: string,
    temporarypass: string | null,
  ): Promise<SMTPTransport.SentMessageInfo> {
    try {
      return await this.emailService.send(
        {
          from: '"Niro Health" <support@niro-health.com>',
          to: [email],
          subject: 'Niro Health - Account Activation',
          priority: 'normal',
        },
        'email-confirm',
        {
          title: `Dear ${username}, please click on the link below to activate your account!`,
          variables: {
            username,
            url: `${this.configurationService.WEBAPP_URI}/account/confirm?token=${token}`,
            temporarypass,
          },
        },
      );
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueError()
  onError(err: Error) {
    throw new Error(`Queue error: ${err.message}`);
  }

  @Process(AccountActivateProcess)
  async handleAccountActivate(job: Job<AccountActivateType>) {
    this.logger.debug(
      `Email for activation of account(${job.data.username}) sent...`,
    );

    return await this._accountEmailConfirm(
      job.data.email,
      job.data.username,
      job.data.token,
      job.data.temporarypass,
    );
  }
}
