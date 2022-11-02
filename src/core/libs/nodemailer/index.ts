import * as path from 'path';
import * as SES from 'aws-sdk/clients/ses';
import * as nodemailer from 'nodemailer';
import { pugEngine } from 'nodemailer-pug-engine';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { Nodemailer as Types } from '@/core/libs/nodemailer/types';
import { awsConfiguration } from '@/core/constants';

export const Templates = {
  default: 'default',
  email_test: 'email-test',
  email_confirm: 'email-confirm',
};

export class Nodemailer implements Types.Class {
  public test(recipient: Types.Recipient) {
    return this.send(recipient, Templates.email_test, {
      title: 'Testing e-mail delivery',
      variables: {},
    });
  }

  public send(
    recipient: Types.Recipient,
    template: string,
    variables: Types.CTX,
  ): Promise<SMTPTransport.SentMessageInfo> {
    return new Promise(async (resolve, reject) => {
      const mailOptions = {
        from: recipient.from,
        to: recipient.to,
        cc: recipient.cc || [],
        bcc: recipient.cco || [],
        priority: recipient.priority || 'normal',
        subject: String(recipient.subject),
        template: String(template),
        ctx: variables,
      };

      const transporter = nodemailer.createTransport({
        SES: { ses: new SES(awsConfiguration), aws: SES },
      });

      transporter.verify((err, info) => {
        if (err) return reject(err);

        if (info) {
          transporter.use(
            'compile',
            pugEngine({
              templateDir: path.resolve(__dirname, '../templates'),
              pretty: true,
            }),
          );

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) return reject(err);
            return resolve(info);
          });
        } else {
          return reject(info);
        }
      });
    });
  }
}
