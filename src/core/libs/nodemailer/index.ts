import * as path from 'path';
import * as SES from 'aws-sdk/clients/ses';
import * as nodemailer from 'nodemailer';
import { pugEngine } from 'nodemailer-pug-engine';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { Nodemailer as Types } from '@/core/libs/nodemailer/types';
import { ProjectOptions } from '@/constants';
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

      let transporter;

      if (ProjectOptions.email.provider === 'aws') {
        transporter = nodemailer.createTransport({
          SES: { ses: new SES(awsConfiguration), aws: SES },
        });
      } else if (ProjectOptions.email.provider === 'smtp') {
        transporter = nodemailer.createTransport({
          host: String(process.env.SMTP_HOST),
          port: parseInt(process.env.SMTP_PORT),
          secure: eval(String(process.env.SMTP_SECURE)),
          auth: {
            user: String(process.env.SMTP_USERNAME),
            pass: String(process.env.SMTP_PASSWORD),
          },
        });
      }

      if (!transporter)
        return reject(
          new Error('No transporter was created. Check your configuration.'),
        );

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
