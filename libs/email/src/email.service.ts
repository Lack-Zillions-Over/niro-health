import { Inject, Injectable } from '@nestjs/common';

import * as SES from 'aws-sdk/clients/ses';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

import { pugEngine } from 'nodemailer-pug-engine';

import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type SESTransport from 'nodemailer/lib/ses-transport';

import type {
  IEmailService,
  Strategy,
  Priority,
  Recipient,
  CTX,
} from '@app/email';
import type { IConfigurationService } from '@app/configuration';
import type { IAwsCoreServiceImpl } from '@app/aws-core';

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IAwsCoreService')
    private readonly awsCoreService: IAwsCoreServiceImpl,
  ) {}

  private _pathTemplates: string = path.resolve(__dirname, './templates');
  private _strategy: Strategy = 'SMTP';
  private _from = '"Niro Health" <support@niro-health.com>';
  private _priority: Priority = 'normal';
  private _cc: string[] = [];
  private _cco: string[] = [];

  public set pathTemplates(path: string) {
    this._pathTemplates = path;
  }

  public get pathTemplates() {
    return this._pathTemplates;
  }

  public set strategy(strategy: Strategy) {
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

  public set priority(priority: Priority) {
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

  public test(recipient: Recipient, template: string) {
    return this.send(recipient, template, {
      title: 'Testing e-mail delivery',
      variables: {},
    });
  }

  public send<T>(
    recipient: Recipient,
    template: string,
    variables: CTX<T>,
  ): Promise<SMTPTransport.SentMessageInfo> {
    return new Promise(async (resolve, reject) => {
      const mailOptions = {
        from: recipient.from || this.from,
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
