import { Injectable } from '@nestjs/common';
import { IValidatorRegexpService } from '@app/validator-regexp/validator-regexp.interface';

@Injectable()
export class ValidatorRegexpService implements IValidatorRegexpService {
  private _messageError(text: string, expression: string) {
    return `Sorry but the value "${text}" is not valid. Please use the pattern "${expression}"`;
  }

  private _exec(pattern: RegExp, text: string, expression: string) {
    if (text.length <= 0) return;
    if (!pattern.test(text))
      throw new Error(this._messageError(text, expression));
  }

  public custom(text: string, regexp: RegExp, expression?: string): void {
    return this._exec(regexp, text, expression);
  }

  public date(text: string) {
    return {
      iso: () =>
        this._exec(
          /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})Z$/,
          text,
          '2011-10-05T14:48:00.000Z',
        ),
    };
  }

  public string(text: string) {
    return {
      common: () =>
        this._exec(
          /^[a-zA-Z\s-_\.]+$/,
          text,
          'john, jane, john-doe, john_doe, john.doe',
        ),
      alphanumeric: () =>
        this._exec(/^[a-zA-Z0-9\s-_\.]+$/, text, 'AKIA56N57H7KHQVADY55'),
      email: () =>
        this._exec(
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          text,
          'jane@nirohealth.com',
        ),
      uuid: () =>
        this._exec(
          /^([\w]{8})-([\w]{4})-([\w]{4})-([\w]{4})-([\w]{12})$/,
          text,
          '01cc800f-61ad-4dcc-a08f-7e74679b6c0e',
        ),
      hash: () =>
        this._exec(
          /^[0-9a-fA-F]{32,}$/,
          text,
          '3b93157d4096c56fd6e96570b6016b87f6443202',
        ),
      password: () =>
        this._exec(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/,
          text,
          'S3nh@Fort3!',
        ),
      secret: () =>
        this._exec(
          /^[a-zA-Z0-9/+=]+$/,
          text,
          'aMIKHAO4USHeyz5b1SqHwKbQcG5ln/D6XkXNqvS8/e0=',
        ),
      smtp: () =>
        this._exec(
          /^[a-z0-9.-]+\.[a-z]{2,}$/,
          text,
          'smtp.gmail.com, smtp.mail.yahoo.com, smtp.mail.com',
        ),
    };
  }

  public boolean(text: string) {
    return this._exec(/^true|false$/, text, 'true or false');
  }

  public number(text: string) {
    return this._exec(/^\d*$/, text, '123456789...');
  }

  public aws(text: string) {
    return {
      api_version: () =>
        this._exec(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/, text, '2006-03-01'),
      region: () =>
        this._exec(/^([a-z]{2})-([a-z]{4,})-([0-9]{1})$/, text, 'us-east-1'),
    };
  }

  public node_env(text: string) {
    return this._exec(
      /^local|development|production|test$/,
      text,
      'development, production or test',
    );
  }

  public version(text: string) {
    return this._exec(/^([0-9]{1,})\.([0-9]{1,})\.([0-9]{1,})$/, text, '1.0.0');
  }

  public uri(text: string) {
    return this._exec(
      /^https?:\/\/([\w.-]+)(:[0-9]+)?\/?$/,
      text,
      'http://localhost:3000',
    );
  }

  public url(text: string) {
    return this._exec(
      /^https?:\/\/([\w.-]+\.[a-z]{2,})(:[0-9]+)?(\/.*)?$/,
      text,
      'https://www.nirohealth.com',
    );
  }

  public postgresURL(text: string) {
    return this._exec(
      /^postgresql:\/\/\w+:\w+@[\w.-]+(:\d{2,5})?\/\w+$/,
      text,
      'postgresql://user:password@localhost:5432/database',
    );
  }

  public redisURL(text: string) {
    return this._exec(
      /^redis:\/\/[^\s\/]+:[0-9]+$/,
      text,
      'redis://redis:6379',
    );
  }

  public cronTimezone(text: string) {
    return this._exec(/^[A-Za-z_]+\/[A-Za-z_]+$/, text, 'America/Sao_Paulo');
  }
}
