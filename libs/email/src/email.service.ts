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

/**
 * @description The module that handles the email delivery.
 */
@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
    @Inject('IAwsCoreService')
    private readonly awsCoreService: IAwsCoreServiceImpl,
  ) {}

  /**
   * @description The path where the templates are located.
   */
  private _pathTemplates: string = path.resolve(__dirname, './templates');

  /**
   * @description The strategy to use to send the email.
   */
  private _strategy: Strategy = 'SMTP';

  /**
   * @description The sender of the email.
   */
  private _from = '"Niro Health" <support@niro-health.com>';

  /**
   * @description The priority of the email.
   */
  private _priority: Priority = 'normal';

  /**
   * @description The CC (Carbon Copy) of the email.
   */
  private _cc: string[] = [];

  /**
   * @description The CCO (Carbon Copy Hidden) of the email.
   */
  private _cco: string[] = [];

  /**
   * @description Set the path where the templates are located.
   * @param {string} path The path where the templates are located.
   */
  public set pathTemplates(path: string) {
    this._pathTemplates = path;
  }

  /**
   * @description Get the path where the templates are located.
   */
  public get pathTemplates() {
    return this._pathTemplates;
  }

  /**
   * @description Set the strategy to use to send the email.
   * @param {Strategy} strategy The strategy to use to send the email.
   */
  public set strategy(strategy: Strategy) {
    this._strategy = strategy;
  }

  /**
   * @description Get the strategy to use to send the email.
   */
  public get strategy() {
    return this._strategy;
  }

  /**
   * @description Set the sender of the email.
   * @param {string} from The sender of the email.
   */
  public set from(from: string) {
    this._from = from;
  }

  /**
   * @description Get the sender of the email.
   */
  public get from() {
    return this._from;
  }

  /**
   * @description Set the priority of the email.
   * @param {Priority} priority The priority of the email.
   */
  public set priority(priority: Priority) {
    this._priority = priority;
  }

  /**
   * @description Get the priority of the email.
   */
  public get priority() {
    return this._priority;
  }

  /**
   * @description Set the CC (Carbon Copy) of the email.
   * @param {string[]} cc The CC (Carbon Copy) of the email.
   */
  public set cc(cc: string[]) {
    this._cc = [...this._cc, ...(cc ?? [])];
  }

  /**
   * @description Get the CC (Carbon Copy) of the email.
   */
  public get cc() {
    return this._cc;
  }

  /**
   * @description Set the CCO (Carbon Copy Hidden) of the email.
   * @param {string[]} cco The CCO (Carbon Copy Hidden) of the email.
   */
  public set cco(cco: string[]) {
    this._cco = [...this._cco, ...(cco ?? [])];
  }

  /**
   * @description Get the CCO (Carbon Copy Hidden) of the email.
   */
  public get cco() {
    return this._cco;
  }

  /**
   * @description Reset list the CC (Carbon Copy) of the email.
   */
  public resetCC() {
    this._cc = [];
  }

  /**
   * @description Reset list the CCO (Carbon Copy Hidden) of the email.
   */
  public resetCCO() {
    this._cco = [];
  }

  /**
   * @description Send a test email.
   * @param {Recipient} recipient The recipient of the email.
   * @param {string} template The template to use.
   */
  public test(recipient: Recipient, template: string) {
    return this.send(recipient, template, {
      title: 'Testing e-mail delivery',
      variables: {},
    });
  }

  /**
   * @description Send an email.
   * @param {Recipient} recipient The recipient of the email.
   * @param {string} template The template to use.
   * @param {CTX<T>} variables The variables to use in the template.
   */
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
          host: this.configurationService.smtp.host,
          port: this.configurationService.smtp.port,
          secure: this.configurationService.smtp.secure,
          auth: {
            user: this.configurationService.smtp.username,
            pass: this.configurationService.smtp.password,
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
