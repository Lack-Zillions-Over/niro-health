import { Injectable } from '@nestjs/common';

import { Configuration } from '@app/configuration/configuration.interface';
import { NODE_ENV } from './configuration.types';

import { DebugService } from '@app/debug';
import { ValidatorRegexpService } from '@app/validator-regexp';
import { StringExService } from '@app/string-ex';

@Injectable()
export class ConfigurationService implements Configuration.Class {
  private _NODE_ENV: NODE_ENV;
  private _VERSION: string;
  private _API_URI: string;
  private _WEBAPP_URI: string;
  private _PORT: number;
  private _DATABASE_URL: string;
  private _DB_PORT: number;
  private _DB_USERNAME: string;
  private _DB_PASSWORD: string;
  private _DB_DATABASE_NAME: string;
  private _MONGODB_USERNAME: string;
  private _MONGODB_PASSWORD: string;
  private _MONGODB_HOST: string;
  private _MONGODB_PORT: string;
  private _MONGODB_NAME: string;
  private _MONGODB_GRIDFS_NAME: string;
  private _MONGODB_CONNECTION_SSL: boolean;
  private _MONGODB_PROJECT_NAME: string;
  private _REDIS_HOST: string;
  private _REDIS_PORT: number;
  private _REDIS_PASSWORD: string;
  private _BULL_BOARD_USERNAME: string;
  private _BULL_BOARD_PASSWORD: string;
  private _CRON_TIMEZONE: string;
  private _CRYPTO_PASSWORD: string;
  private _MASTER_KEY: string;
  private _JWT_SECRET: string;
  private _COOKIE_SECRET: string;
  private _SESSION_SECRET: string;
  private _AXIOS_URI: string;
  private _AXIOS_AUTHORIZATION: string;
  private _AWS_ACCESS_KEY_ID: string;
  private _AWS_SECRET_ACCESS_KEY: string;
  private _SMTP_HOST: string;
  private _SMTP_PORT: number;
  private _SMTP_SECURE: boolean;
  private _SMTP_USERNAME: string;
  private _SMTP_PASSWORD: string;
  static '@ENVS': Configuration.ENVS = {};
  static '@VARIABLES': Configuration.VARIABLES = {};

  constructor(
    private readonly debugService: DebugService,
    private readonly validatorRegexpService: ValidatorRegexpService,
    private readonly stringExService: StringExService,
  ) {
    this._check();
    this._load();
    return Object.freeze(this) as unknown as ConfigurationService;
  }

  private _check() {
    this.validatorRegexpService.node_env(process.env.NODE_ENV);
    this.validatorRegexpService.version(process.env.VERSION);
    this.validatorRegexpService.uri(process.env.API_URI);
    this.validatorRegexpService.uri(process.env.WEBAPP_URI);
    this.validatorRegexpService.number(process.env.PORT);
    this.validatorRegexpService.postgresURL(process.env.DATABASE_URL);
    this.validatorRegexpService.number(process.env.DB_PORT);
    this.validatorRegexpService.string(process.env.DB_USERNAME).common();
    this.validatorRegexpService.string(process.env.DB_PASSWORD).alphanumeric();
    this.validatorRegexpService.string(process.env.DB_DATABASE_NAME).common();
    this.validatorRegexpService.string(process.env.MONGODB_USERNAME).common();
    this.validatorRegexpService
      .string(process.env.MONGODB_PASSWORD)
      .alphanumeric();
    this.validatorRegexpService.string(process.env.MONGODB_HOST).alphanumeric();
    this.validatorRegexpService.string(process.env.MONGODB_PORT).alphanumeric();
    this.validatorRegexpService.string(process.env.MONGODB_NAME).common();
    this.validatorRegexpService
      .string(process.env.MONGODB_GRIDFS_NAME)
      .common();
    this.validatorRegexpService.boolean(process.env.MONGODB_CONNECTION_SSL);
    this.validatorRegexpService.string(process.env.MONGODB_PROJECT_NAME);
    this.validatorRegexpService.redisURL(process.env.REDIS_HOST);
    this.validatorRegexpService.number(process.env.REDIS_PORT);
    this.validatorRegexpService.string(process.env.REDIS_PASSWORD).password();
    this.validatorRegexpService
      .string(process.env.BULL_BOARD_USERNAME)
      .common();
    this.validatorRegexpService
      .string(process.env.BULL_BOARD_PASSWORD)
      .alphanumeric();
    this.validatorRegexpService.cronTimezone(process.env.CRON_TIMEZONE);
    this.validatorRegexpService.string(process.env.CRYPTO_PASSWORD).secret();
    this.validatorRegexpService.string(process.env.MASTER_KEY).secret();
    this.validatorRegexpService.string(process.env.JWT_SECRET).secret();
    this.validatorRegexpService.string(process.env.COOKIE_SECRET).secret();
    this.validatorRegexpService.string(process.env.SESSION_SECRET).secret();
    this.validatorRegexpService.uri(process.env.AXIOS_URI);
    this.validatorRegexpService.string(process.env.AXIOS_AUTHORIZATION).hash();
    this.validatorRegexpService
      .string(process.env.AWS_ACCESS_KEY_ID)
      .alphanumeric();
    this.validatorRegexpService
      .string(process.env.AWS_SECRET_ACCESS_KEY)
      .alphanumeric();
    this.validatorRegexpService.string(process.env.SMTP_HOST).smtp();
    this.validatorRegexpService.number(process.env.SMTP_PORT);
    this.validatorRegexpService.string(process.env.SMTP_USERNAME).email();
    this.validatorRegexpService
      .string(process.env.SMTP_PASSWORD)
      .alphanumeric();
  }

  private _load() {
    this._NODE_ENV = process.env.NODE_ENV as NODE_ENV;
    this._VERSION = process.env.VERSION;
    this._API_URI = process.env.API_URI;
    this._WEBAPP_URI = process.env.WEBAPP_URI;
    this._PORT = parseInt(process.env.PORT);
    this._DATABASE_URL = process.env.DATABASE_URL;
    this._DB_PORT = parseInt(process.env.DB_PORT);
    this._DB_USERNAME = process.env.DB_USERNAME;
    this._DB_PASSWORD = process.env.DB_PASSWORD;
    this._DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;
    this._MONGODB_USERNAME = process.env.MONGODB_USERNAME;
    this._MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
    this._MONGODB_HOST = process.env.MONGODB_HOST;
    this._MONGODB_PORT = process.env.MONGODB_PORT;
    this._MONGODB_NAME = process.env.MONGODB_NAME;
    this._MONGODB_GRIDFS_NAME = process.env.MONGODB_GRIDFS_NAME;
    this._MONGODB_CONNECTION_SSL = this._transformBoolean(
      process.env.MONGODB_CONNECTION_SSL,
    );
    this._MONGODB_PROJECT_NAME = process.env.MONGODB_PROJECT_NAME;
    this._REDIS_HOST = process.env.REDIS_HOST;
    this._REDIS_PORT = parseInt(process.env.REDIS_PORT);
    this._REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    this._BULL_BOARD_USERNAME = process.env.BULL_BOARD_USERNAME;
    this._BULL_BOARD_PASSWORD = process.env.BULL_BOARD_PASSWORD;
    this._CRON_TIMEZONE = process.env.CRON_TIMEZONE;
    this._CRYPTO_PASSWORD = process.env.CRYPTO_PASSWORD;
    this._MASTER_KEY = process.env.MASTER_KEY;
    this._JWT_SECRET = process.env.JWT_SECRET;
    this._COOKIE_SECRET = process.env.COOKIE_SECRET;
    this._SESSION_SECRET = process.env.SESSION_SECRET;
    this._AXIOS_URI = process.env.AXIOS_URI;
    this._AXIOS_AUTHORIZATION = process.env.AXIOS_AUTHORIZATION;
    this._AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    this._AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    this._SMTP_HOST = process.env.SMTP_HOST;
    this._SMTP_PORT = parseInt(process.env.SMTP_PORT);
    this._SMTP_SECURE = this._transformBoolean(process.env.SMTP_SECURE);
    this._SMTP_USERNAME = process.env.SMTP_USERNAME;
    this._SMTP_PASSWORD = process.env.SMTP_PASSWORD;
  }

  private _transformBoolean(text: string) {
    const regex = /\b(true|false)\b/g;
    const match = text.match(regex);

    if (match === null)
      throw new Error(`The value ${text} is not a boolean value`);

    return eval(match[0]);
  }

  private _compress<T>(value: T): string {
    return this.stringExService.compress(value);
  }

  private _decompress<T>(value: string): T {
    return this.stringExService.decompress(value) as T;
  }

  public get<T>(key: string): T {
    if (!ConfigurationService['@ENVS'][key]) return null;
    return this._decompress(ConfigurationService['@ENVS'][key]);
  }

  public register<T>(key: string, value: T): void {
    ConfigurationService['@ENVS'][key] = this._compress(value);
  }

  public unregister(key: string): void {
    ConfigurationService['@ENVS'][key] = null;
  }

  public getVariable<T>(key: string): T {
    if (!ConfigurationService['@VARIABLES'][key]) return null;
    return this._decompress(ConfigurationService['@VARIABLES'][key]);
  }

  public setVariable<T>(key: string, value: T): void {
    ConfigurationService['@VARIABLES'][key] = this._compress(value);
  }

  public delVariable(key: string): void {
    ConfigurationService['@ENVS'][key] = null;
  }

  get NODE_ENV() {
    return this._NODE_ENV;
  }

  get VERSION() {
    return this._VERSION;
  }

  get API_URI() {
    return this._API_URI;
  }

  get WEBAPP_URI() {
    return this._WEBAPP_URI;
  }

  get PORT() {
    return this._PORT;
  }

  get DATABASE_URL() {
    return this._DATABASE_URL;
  }

  get DB_PORT() {
    return this._DB_PORT;
  }

  get DB_USERNAME() {
    return this._DB_USERNAME;
  }

  get DB_PASSWORD() {
    return this._DB_PASSWORD;
  }

  get DB_DATABASE_NAME() {
    return this._DB_DATABASE_NAME;
  }

  get MONGODB_USERNAME() {
    return this._MONGODB_USERNAME;
  }

  get MONGODB_PASSWORD() {
    return this._MONGODB_PASSWORD;
  }

  get MONGODB_HOST() {
    return this._MONGODB_HOST;
  }

  get MONGODB_PORT() {
    return this._MONGODB_PORT;
  }

  get MONGODB_NAME() {
    return this._MONGODB_NAME;
  }

  get MONGODB_GRIDFS_NAME() {
    return this._MONGODB_GRIDFS_NAME;
  }

  get MONGODB_CONNECTION_SSL() {
    return this._MONGODB_CONNECTION_SSL;
  }

  get MONGODB_PROJECT_NAME() {
    return this._MONGODB_PROJECT_NAME;
  }

  get REDIS_HOST() {
    return this._REDIS_HOST;
  }

  get REDIS_PORT() {
    return this._REDIS_PORT;
  }

  get REDIS_PASSWORD() {
    return this._REDIS_PASSWORD;
  }

  get BULL_BOARD_USERNAME() {
    return this._BULL_BOARD_USERNAME;
  }

  get BULL_BOARD_PASSWORD() {
    return this._BULL_BOARD_PASSWORD;
  }

  get CRON_TIMEZONE() {
    return this._CRON_TIMEZONE;
  }

  get CRYPTO_PASSWORD() {
    return this._CRYPTO_PASSWORD;
  }

  get MASTER_KEY() {
    return this._MASTER_KEY;
  }

  get JWT_SECRET() {
    return this._JWT_SECRET;
  }

  get COOKIE_SECRET() {
    return this._COOKIE_SECRET;
  }

  get SESSION_SECRET() {
    return this._SESSION_SECRET;
  }

  get AXIOS_URI() {
    return this._AXIOS_URI;
  }

  get AXIOS_AUTHORIZATION() {
    return this._AXIOS_AUTHORIZATION;
  }

  get AWS_ACCESS_KEY_ID() {
    return this._AWS_ACCESS_KEY_ID;
  }

  get AWS_SECRET_ACCESS_KEY() {
    return this._AWS_SECRET_ACCESS_KEY;
  }

  get SMTP_HOST() {
    return this._SMTP_HOST;
  }

  get SMTP_PORT() {
    return this._SMTP_PORT;
  }

  get SMTP_SECURE() {
    return this._SMTP_SECURE;
  }

  get SMTP_USERNAME() {
    return this._SMTP_USERNAME;
  }

  get SMTP_PASSWORD() {
    return this._SMTP_PASSWORD;
  }

  get ENV(): NODE_ENV {
    return this.NODE_ENV;
  }

  get isDev(): boolean {
    return String(this.ENV).toLowerCase() === 'development';
  }

  get isProd(): boolean {
    return String(this.ENV).toLowerCase() === 'production';
  }

  get isTest(): boolean {
    return String(this.ENV).toLowerCase() === 'test';
  }

  get mongoDB(): {
    username: string;
    password: string;
    host: string;
    port: string;
    name: string;
    gridfsName: string;
    connectionSSL: boolean;
    projectName: string;
  } {
    return {
      username: this.MONGODB_USERNAME,
      password: this.MONGODB_PASSWORD,
      host: this.MONGODB_HOST,
      port: this.MONGODB_PORT,
      name: this.MONGODB_NAME,
      gridfsName: this.MONGODB_GRIDFS_NAME,
      connectionSSL: this.MONGODB_CONNECTION_SSL,
      projectName: this.MONGODB_PROJECT_NAME,
    };
  }

  get redis(): { host: string; port: number; password: string } {
    return {
      host: this.REDIS_HOST,
      port: this.REDIS_PORT,
      password: this.REDIS_PASSWORD,
    };
  }

  get bullBoard(): { username: string; password: string } {
    return {
      username: this.BULL_BOARD_USERNAME,
      password: this.BULL_BOARD_PASSWORD,
    };
  }

  get secrets(): {
    cryptoPassword: string;
    masterKey: string;
    jwtSecret: string;
    cookieSecret: string;
    sessionSecret: string;
  } {
    return {
      cryptoPassword: this.CRYPTO_PASSWORD,
      masterKey: this.MASTER_KEY,
      jwtSecret: this.JWT_SECRET,
      cookieSecret: this.COOKIE_SECRET,
      sessionSecret: this.SESSION_SECRET,
    };
  }

  get axios(): { uri: string; authorization: string } {
    return {
      uri: this.AXIOS_URI,
      authorization: this.AXIOS_AUTHORIZATION,
    };
  }

  get aws(): { accessKeyId: string; secretAccessKey: string } {
    return {
      accessKeyId: this.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
    };
  }

  get smtp(): {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  } {
    return {
      host: this.SMTP_HOST,
      port: this.SMTP_PORT,
      secure: this.SMTP_SECURE,
      username: this.SMTP_USERNAME,
      password: this.SMTP_PASSWORD,
    };
  }
}
