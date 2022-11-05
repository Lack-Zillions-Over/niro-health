import { Injectable } from '@nestjs/common';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { Nodemailer } from '@/core/libs/nodemailer';
import { Templates } from '@/core/libs/nodemailer';
import { EmailSend as Types } from '@/core/utils/emailSend/types';

@Injectable()
export class EmailSend implements Types.Class {
  private readonly nodemailer: Nodemailer;

  constructor() {
    this.nodemailer = new Nodemailer();
  }

  public async accountEmailConfirm(
    email: string,
    username: string,
    token: string,
    temporarypass: string | null,
  ): Promise<SMTPTransport.SentMessageInfo> {
    try {
      const options: Types.Options = {
        from: '"Niro Health" <noreply@nirohealth.com>',
        email: email,
        subject: 'Niro Health - Account Activation',
        title: `Dear ${username}, please click on the link below to activate your account!`,
        priority: 'high',
        variables: {
          username,
          url: `${process.env.WEBAPP_URI}/account/confirm?token=${token}`,
          temporarypass,
        },
      };

      return await this.nodemailer.send(
        {
          from: options.from,
          to: [options.email],
          subject: options.subject,
          priority: options.priority,
        },
        Templates.email_confirm,
        {
          title: options.title,
          variables: options.variables,
        },
      );
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  }
}
