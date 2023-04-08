import { Injectable } from '@nestjs/common';

import * as SES from 'aws-sdk/clients/ses';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import SESTransport from 'nodemailer/lib/ses-transport';
import { pugEngine } from 'nodemailer-pug-engine';

import { Email } from '@app/email/email.interface';
import { ConfigurationService } from '@app/configuration';
import { AwsCoreService } from '@app/aws-core';

@Injectable()
export class EmailService implements Email.Class {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly awsCoreService: AwsCoreService,
  ) {}

  private _pathTemplates: string = path.resolve(__dirname, '../templates');
  private _strategy: Email.Strategy = 'SMTP';
  private _from = '"Niro Health" <noreply@nirohealth.com>';
  private _priority: Email.Priority = 'normal';
  private _cc: string[] = [];
  private _cco: string[] = [];

  public set pathTemplates(path: string) {
    this._pathTemplates = path;
  }

  public get pathTemplates() {
    return this._pathTemplates;
  }

  public set strategy(strategy: Email.Strategy) {
    this._strategy = strategy;
  }

  public get strategy() {
    return this._strategy;
  }

  public set from(from: string) {
    this._from = from;
  }

  public get from() {
    return this._from;
  }

  public set priority(priority: Email.Priority) {
    this._priority = priority;
  }

  public get priority() {
    return this._priority;
  }

  public set cc(cc: string[]) {
    this._cc = [...this._cc, ...(cc ?? [])];
  }

  public get cc() {
    return this._cc;
  }

  public set cco(cco: string[]) {
    this._cco = [...this._cco, ...(cco ?? [])];
  }

  public get cco() {
    return this._cco;
  }

  public test(recipient: Email.Recipient, template: string) {
    return this.send(recipient, template, {
      title: 'Testing e-mail delivery',
      variables: {},
    });
  }

  public send<T>(
    recipient: Email.Recipient,
    template: string,
    variables: Email.CTX<T>,
  ): Promise<SMTPTransport.SentMessageInfo> {
    return new Promise(async (resolve, reject) => {
      const mailOptions = {
        from: this.from,
        to: recipient.to,
        cc: recipient.cc || this.cc,
        bcc: recipient.cco || this.cco,
        priority: recipient.priority || this.priority,
        subject: String(recipient.subject),
        template: String(template),
        ctx: variables,
      };

      let transporter: nodemailer.Transporter<SESTransport.SentMessageInfo>;

      if (this.strategy === 'AWS') {
        transporter = nodemailer.createTransport({
          SES: {
            ses: new SES({
              ...(await this.awsCoreService.configuration()),
            }),
            aws: SES,
          },
        });
      } else if (this.strategy === 'SMTP') {
        transporter = nodemailer.createTransport({
          host: this.configurationService.SMTP_HOST,
          port: this.configurationService.SMTP_PORT,
          secure: this.configurationService.SMTP_SECURE,
          auth: {
            user: this.configurationService.SMTP_USERNAME,
            pass: this.configurationService.SMTP_PASSWORD,
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
              templateDir: this.pathTemplates,
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
