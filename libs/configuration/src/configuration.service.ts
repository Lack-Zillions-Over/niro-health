import { Inject, Injectable } from '@nestjs/common';

import {
  IConfigurationService,
  NODE_ENV,
  ENVS,
  VARIABLES,
} from '@app/configuration/configuration.interface';

import {
  IStringExService,
  CompressData,
} from '@app/string-ex/string-ex.interface';
import { IValidatorRegexpService } from '@app/validator-regexp/validator-regexp.interface';

/**
 * @description The module provides a service for configuring the application.
 */
@Injectable()
export class ConfigurationService implements IConfigurationService {
  /**
   * @description The node environment to use.
   */
  private _NODE_ENV: NODE_ENV;

  /**
   * @description The application version.
   */
  private _VERSION: string;

  /**
   * @description The application back-end API URI.
   */
  private _API_URI: string;

  /**
   * @description The application front-end API URI.
   */
  private _WEBAPP_URI: string;

  /**
   * @description The port to use.
   */
  private _PORT: number;

  /**
   * @description The database URL.
   */
  private _DATABASE_URL: string;

  /**
   * @description The database port.
   */
  private _DB_PORT: number;

  /**
   * @description The database username.
   */
  private _DB_USERNAME: string;

  /**
   * @description The database password.
   */
  private _DB_PASSWORD: string;

  /**
   * @description The database name.
   */
  private _DB_DATABASE_NAME: string;

  /**
   * @description The mongodb username.
   */
  private _MONGODB_USERNAME: string;

  /**
   * @description The mongodb password.
   */
  private _MONGODB_PASSWORD: string;

  /**
   * @description The mongodb host.
   */
  private _MONGODB_HOST: string;

  /**
   * @description The mongodb port.
   */
  private _MONGODB_PORT: string;

  /**
   * @description The mongodb name.
   */
  private _MONGODB_NAME: string;

  /**
   * @description The mongodb gridfs name.
   */
  private _MONGODB_GRIDFS_NAME: string;

  /**
   * @description The mongodb connection ssl.
   */
  private _MONGODB_CONNECTION_SSL: boolean;

  /**
   * @description The mongodb project name.
   */
  private _MONGODB_PROJECT_NAME: string;

  /**
   * @description The redis host.
   */
  private _REDIS_HOST: string;

  /**
   * @description The redis port.
   */
  private _REDIS_PORT: number;

  /**
   * @description The redis password.
   */
  private _REDIS_PASSWORD: string;

  /**
   * @description The bull board username.
   */
  private _BULL_BOARD_USERNAME: string;

  /**
   * @description The bull board password.
   */
  private _BULL_BOARD_PASSWORD: string;

  /**
   * @description The cron timezone.
   */
  private _CRON_TIMEZONE: string;

  /**
   * @description The crypto password.
   */
  private _CRYPTO_PASSWORD: string;

  /**
   * @description The master key.
   */
  private _MASTER_KEY: string;

  /**
   * @description The secret for Json Web Token.
   */
  private _JWT_SECRET: string;

  /**
   * @description The secret for the cookies.
   */
  private _COOKIE_SECRET: string;

  /**
   * @description The secret for the sessions.
   */
  private _SESSION_SECRET: string;

  /**
   * @description The URI for the axios requests.
   */
  private _AXIOS_URI: string;

  /**
   * @description The authorization for the axios requests.
   */
  private _AXIOS_AUTHORIZATION: string;

  /**
   * @description The AWS access key id.
   */
  private _AWS_ACCESS_KEY_ID: string;

  /**
   * @description The AWS secret access key.
   */
  private _AWS_SECRET_ACCESS_KEY: string;

  /**
   * @description The SMTP host.
   */
  private _SMTP_HOST: string;

  /**
   * @description The SMTP port.
   */
  private _SMTP_PORT: number;

  /**
   * @description The SMTP secure.
   */
  private _SMTP_SECURE: boolean;

  /**
   * @description The SMTP username.
   */
  private _SMTP_USERNAME: string;

  /**
   * @description The SMTP password.
   */
  private _SMTP_PASSWORD: string;

  /**
   * @description The environment variables.
   */
  static '@ENVS': ENVS = {};

  /**
   * @description The variables.
   */
  static '@VARIABLES': VARIABLES = {};

  constructor(
    @Inject('IValidatorRegexpService')
    private readonly validatorRegexpService: IValidatorRegexpService,
    @Inject('IStringExService')
    private readonly stringExService: IStringExService,
  ) {
    this._check();
    this._load();
    return Object.freeze<ConfigurationService>(
      this as ConfigurationService,
    ) as ConfigurationService;
  }

  /**
   * @description Check the environment variables.
   */
  private _check() {
    if (process.env.NODE_ENV) {
      this.validatorRegexpService.node_env(process.env.NODE_ENV);
    }

    if (process.env.VERSION) {
      this.validatorRegexpService.version(process.env.VERSION);
    }

    if (process.env.API_URI) {
      this.validatorRegexpService.uri(process.env.API_URI);
    }

    if (process.env.WEBAPP_URI) {
      this.validatorRegexpService.uri(process.env.WEBAPP_URI);
    }

    if (process.env.PORT) {
      this.validatorRegexpService.number(process.env.PORT);
    }

    if (process.env.DATABASE_URL) {
      this.validatorRegexpService.postgresURL(process.env.DATABASE_URL);
    }

    if (process.env.DB_PORT) {
      this.validatorRegexpService.number(process.env.DB_PORT);
    }

    if (process.env.DB_USERNAME) {
      this.validatorRegexpService.string(process.env.DB_USERNAME).common();
    }

    if (process.env.DB_PASSWORD) {
      this.validatorRegexpService
        .string(process.env.DB_PASSWORD)
        .alphanumeric();
    }

    if (process.env.DB_DATABASE_NAME) {
      this.validatorRegexpService.string(process.env.DB_DATABASE_NAME).common();
    }

    if (process.env.MONGODB_USERNAME) {
      this.validatorRegexpService.string(process.env.MONGODB_USERNAME).common();
    }

    if (process.env.MONGODB_PASSWORD) {
      this.validatorRegexpService
        .string(process.env.MONGODB_PASSWORD)
        .alphanumeric();
    }

    if (process.env.MONGODB_HOST) {
      this.validatorRegexpService
        .string(process.env.MONGODB_HOST)
        .alphanumeric();
    }

    if (process.env.MONGODB_PORT) {
      this.validatorRegexpService
        .string(process.env.MONGODB_PORT)
        .alphanumeric();
    }

    if (process.env.MONGODB_NAME) {
      this.validatorRegexpService.string(process.env.MONGODB_NAME).common();
    }

    if (process.env.MONGODB_GRIDFS_NAME) {
      this.validatorRegexpService
        .string(process.env.MONGODB_GRIDFS_NAME)
        .common();
    }

    if (process.env.MONGODB_CONNECTION_SSL) {
      this.validatorRegexpService.boolean(process.env.MONGODB_CONNECTION_SSL);
    }

    if (process.env.MONGODB_PROJECT_NAME) {
      this.validatorRegexpService.string(process.env.MONGODB_PROJECT_NAME);
    }

    if (process.env.REDIS_HOST) {
      this.validatorRegexpService.redisURL(process.env.REDIS_HOST);
    }

    if (process.env.REDIS_PORT) {
      this.validatorRegexpService.number(process.env.REDIS_PORT);
    }

    if (process.env.REDIS_PASSWORD) {
      this.validatorRegexpService.string(process.env.REDIS_PASSWORD).password();
    }

    if (process.env.BULL_BOARD_USERNAME) {
      this.validatorRegexpService
        .string(process.env.BULL_BOARD_USERNAME)
        .common();
    }

    if (process.env.BULL_BOARD_PASSWORD) {
      this.validatorRegexpService
        .string(process.env.BULL_BOARD_PASSWORD)
        .alphanumeric();
    }

    if (process.env.CRON_TIMEZONE) {
      this.validatorRegexpService.cronTimezone(process.env.CRON_TIMEZONE);
    }

    if (process.env.CRYPTO_PASSWORD) {
      this.validatorRegexpService.string(process.env.CRYPTO_PASSWORD).secret();
    }

    if (process.env.MASTER_KEY) {
      this.validatorRegexpService.string(process.env.MASTER_KEY).secret();
    }

    if (process.env.JWT_SECRET) {
      this.validatorRegexpService.string(process.env.JWT_SECRET).secret();
    }

    if (process.env.COOKIE_SECRET) {
      this.validatorRegexpService.string(process.env.COOKIE_SECRET).secret();
    }

    if (process.env.SESSION_SECRET) {
      this.validatorRegexpService.string(process.env.SESSION_SECRET).secret();
    }

    if (process.env.AXIOS_URI) {
      this.validatorRegexpService.uri(process.env.AXIOS_URI);
    }

    if (process.env.AXIOS_AUTHORIZATION) {
      this.validatorRegexpService
        .string(process.env.AXIOS_AUTHORIZATION)
        .hash();
    }

    if (process.env.AWS_ACCESS_KEY_ID) {
      this.validatorRegexpService
        .string(process.env.AWS_ACCESS_KEY_ID)
        .alphanumeric();
    }

    if (process.env.AWS_SECRET_ACCESS_KEY) {
      this.validatorRegexpService
        .string(process.env.AWS_SECRET_ACCESS_KEY)
        .alphanumeric();
    }

    if (process.env.SMTP_HOST) {
      this.validatorRegexpService.string(process.env.SMTP_HOST).smtp();
    }

    if (process.env.SMTP_PORT) {
      this.validatorRegexpService.number(process.env.SMTP_PORT);
    }

    if (process.env.SMTP_USERNAME) {
      this.validatorRegexpService.string(process.env.SMTP_USERNAME).email();
    }

    if (process.env.SMTP_PASSWORD) {
      this.validatorRegexpService.string(process.env.SMTP_PASSWORD).password();
    }
  }

  /**
   * @description Load environment variables.
   */
  private _load() {
    if (process.env.NODE_ENV) {
      this._NODE_ENV = process.env.NODE_ENV as NODE_ENV;
    }

    if (process.env.VERSION) {
      this._VERSION = process.env.VERSION;
    }

    if (process.env.API_URI) {
      this._API_URI = process.env.API_URI;
    }

    if (process.env.WEBAPP_URI) {
      this._WEBAPP_URI = process.env.WEBAPP_URI;
    }

    if (process.env.PORT) {
      this._PORT = parseInt(process.env.PORT);
    }

    if (process.env.DATABASE_URL) {
      this._DATABASE_URL = process.env.DATABASE_URL;
    }

    if (process.env.DB_PORT) {
      this._DB_PORT = parseInt(process.env.DB_PORT);
    }

    if (process.env.DB_USERNAME) {
      this._DB_USERNAME = process.env.DB_USERNAME;
    }

    if (process.env.DB_PASSWORD) {
      this._DB_PASSWORD = process.env.DB_PASSWORD;
    }

    if (process.env.DB_DATABASE_NAME) {
      this._DB_DATABASE_NAME = process.env.DB_DATABASE_NAME;
    }

    if (process.env.MONGODB_USERNAME) {
      this._MONGODB_USERNAME = process.env.MONGODB_USERNAME;
    }

    if (process.env.MONGODB_PASSWORD) {
      this._MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
    }

    if (process.env.MONGODB_HOST) {
      this._MONGODB_HOST = process.env.MONGODB_HOST;
    }

    if (process.env.MONGODB_PORT) {
      this._MONGODB_PORT = process.env.MONGODB_PORT;
    }

    if (process.env.MONGODB_NAME) {
      this._MONGODB_NAME = process.env.MONGODB_NAME;
    }

    if (process.env.MONGODB_GRIDFS_NAME) {
      this._MONGODB_GRIDFS_NAME = process.env.MONGODB_GRIDFS_NAME;
    }

    if (process.env.MONGODB_CONNECTION_SSL) {
      this._MONGODB_CONNECTION_SSL = this._transformBoolean(
        process.env.MONGODB_CONNECTION_SSL,
      );
    }

    if (process.env.MONGODB_PROJECT_NAME) {
      this._MONGODB_PROJECT_NAME = process.env.MONGODB_PROJECT_NAME;
    }

    if (process.env.REDIS_HOST) {
      this._REDIS_HOST = process.env.REDIS_HOST;
    }

    if (process.env.REDIS_PORT) {
      this._REDIS_PORT = parseInt(process.env.REDIS_PORT);
    }

    if (process.env.REDIS_PASSWORD) {
      this._REDIS_PASSWORD = process.env.REDIS_PASSWORD;
    }

    if (process.env.BULL_BOARD_USERNAME) {
      this._BULL_BOARD_USERNAME = process.env.BULL_BOARD_USERNAME;
    }

    if (process.env.BULL_BOARD_PASSWORD) {
      this._BULL_BOARD_PASSWORD = process.env.BULL_BOARD_PASSWORD;
    }

    if (process.env.CRON_TIMEZONE) {
      this._CRON_TIMEZONE = process.env.CRON_TIMEZONE;
    }

    if (process.env.CRYPTO_PASSWORD) {
      this._CRYPTO_PASSWORD = process.env.CRYPTO_PASSWORD;
    }

    if (process.env.MASTER_KEY) {
      this._MASTER_KEY = process.env.MASTER_KEY;
    }

    if (process.env.JWT_SECRET) {
      this._JWT_SECRET = process.env.JWT_SECRET;
    }

    if (process.env.COOKIE_SECRET) {
      this._COOKIE_SECRET = process.env.COOKIE_SECRET;
    }

    if (process.env.SESSION_SECRET) {
      this._SESSION_SECRET = process.env.SESSION_SECRET;
    }

    if (process.env.AXIOS_URI) {
      this._AXIOS_URI = process.env.AXIOS_URI;
    }

    if (process.env.AXIOS_AUTHORIZATION) {
      this._AXIOS_AUTHORIZATION = process.env.AXIOS_AUTHORIZATION;
    }

    if (process.env.AWS_ACCESS_KEY_ID) {
      this._AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    }

    if (process.env.AWS_SECRET_ACCESS_KEY) {
      this._AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    }

    if (process.env.SMTP_HOST) {
      this._SMTP_HOST = process.env.SMTP_HOST;
    }

    if (process.env.SMTP_PORT) {
      this._SMTP_PORT = parseInt(process.env.SMTP_PORT);
    }

    if (process.env.SMTP_SECURE) {
      this._SMTP_SECURE = this._transformBoolean(process.env.SMTP_SECURE);
    }

    if (process.env.SMTP_USERNAME) {
      this._SMTP_USERNAME = process.env.SMTP_USERNAME;
    }

    if (process.env.SMTP_PASSWORD) {
      this._SMTP_PASSWORD = process.env.SMTP_PASSWORD;
    }
  }

  /**
   * @description Transform string to boolean.
   */
  private _transformBoolean(text: string) {
    const regex = /\b(true|false)\b/g;
    const match = text.match(regex);

    if (match === null)
      throw new Error(`The value ${text} is not a boolean value`);

    return eval(match[0]);
  }

  /**
   * @description Compress the value to string.
   * @param value The value to compress
   */
  private _compress(value: CompressData): string {
    return this.stringExService.compress(value);
  }

  /**
   * @description Decompress the string to original value.
   * @param value The string to decompress
   */
  private _decompress(value: string): CompressData {
    return this.stringExService.decompress(value);
  }

  /**
   * @description Get the value from the environment.
   * @param key The key of the environment
   */
  public get<T = CompressData>(key: string): T {
    if (!ConfigurationService['@ENVS'][key]) return null;
    return this._decompress(ConfigurationService['@ENVS'][key]) as T;
  }

  /**
   * @description Set the value to the environment.
   * @param key The key of the environment
   * @param value The value of the environment
   */
  public register<T = CompressData>(key: string, value: T): void {
    ConfigurationService['@ENVS'][key] = this._compress(value as CompressData);
  }

  /**
   * @description Delete the value from the environment.
   * @param key The key of the environment
   */
  public unregister(key: string): void {
    ConfigurationService['@ENVS'][key] = null;
  }

  /**
   * @description Get the value from the variable.
   * @param key The key of the variable
   */
  public getVariable<T = CompressData>(key: string): T {
    if (!ConfigurationService['@VARIABLES'][key]) return null;
    return this._decompress(ConfigurationService['@VARIABLES'][key]) as T;
  }

  /**
   * @description Set the value to the variable.
   * @param key The key of the variable
   * @param value The value of the variable
   */
  public setVariable<T = CompressData>(key: string, value: T): void {
    ConfigurationService['@VARIABLES'][key] = this._compress(
      value as CompressData,
    );
  }

  /**
   * @description Delete the value from the variable.
   * @param key The key of the variable
   */
  public delVariable(key: string): void {
    ConfigurationService['@VARIABLES'][key] = null;
  }

  /**
   * @description Returns the node environment.
   */
  public get NODE_ENV() {
    return this._NODE_ENV;
  }

  /**
   * @description Returns the version of the application.
   */
  public get VERSION() {
    return this._VERSION;
  }

  /**
   * @description Returns the uri of the back-end.
   */
  public get API_URI() {
    return this._API_URI;
  }

  /**
   * @description Returns the uri of the front-end.
   */
  public get WEBAPP_URI() {
    return this._WEBAPP_URI;
  }

  /**
   * @description Returns the port of the application.
   */
  public get PORT() {
    return this._PORT;
  }

  /**
   * @description Returns the url of the database.
   */
  public get DATABASE_URL() {
    return this._DATABASE_URL;
  }

  /**
   * @description Returns the port of the database.
   */
  public get DB_PORT() {
    return this._DB_PORT;
  }

  /**
   * @description Returns the username of the database.
   */
  public get DB_USERNAME() {
    return this._DB_USERNAME;
  }

  /**
   * @description Returns the password of the database.
   */
  public get DB_PASSWORD() {
    return this._DB_PASSWORD;
  }

  /**
   * @description Returns the name of the database.
   */
  public get DB_DATABASE_NAME() {
    return this._DB_DATABASE_NAME;
  }

  /**
   * @description Returns the username of the mongodb.
   */
  public get MONGODB_USERNAME() {
    return this._MONGODB_USERNAME;
  }

  /**
   * @description Returns the password of the mongodb.
   */
  public get MONGODB_PASSWORD() {
    return this._MONGODB_PASSWORD;
  }

  /**
   * @description Returns the host of the mongodb.
   */
  public get MONGODB_HOST() {
    return this._MONGODB_HOST;
  }

  /**
   * @description Returns the port of the mongodb.
   */
  public get MONGODB_PORT() {
    return this._MONGODB_PORT;
  }

  /**
   * @description Returns the name of the mongodb.
   */
  public get MONGODB_NAME() {
    return this._MONGODB_NAME;
  }

  /**
   * @description Returns the name of the gridfs in mongodb.
   */
  public get MONGODB_GRIDFS_NAME() {
    return this._MONGODB_GRIDFS_NAME;
  }

  /**
   * @description Returns the ssl connection of the mongodb.
   */
  public get MONGODB_CONNECTION_SSL() {
    return this._MONGODB_CONNECTION_SSL;
  }

  /**
   * @description Returns the project name of the mongodb.
   */
  public get MONGODB_PROJECT_NAME() {
    return this._MONGODB_PROJECT_NAME;
  }

  /**
   * @description Returns the host of the redis.
   */
  public get REDIS_HOST() {
    return this._REDIS_HOST;
  }

  /**
   * @description Returns the port of the redis.
   */
  public get REDIS_PORT() {
    return this._REDIS_PORT;
  }

  /**
   * @description Returns the password of the redis.
   */
  public get REDIS_PASSWORD() {
    return this._REDIS_PASSWORD;
  }

  /**
   * @description Returns the username of the bull board.
   */
  public get BULL_BOARD_USERNAME() {
    return this._BULL_BOARD_USERNAME;
  }

  /**
   * @description Returns the password of the bull board.
   */
  public get BULL_BOARD_PASSWORD() {
    return this._BULL_BOARD_PASSWORD;
  }

  /**
   * @description Returns the timezone of the cron.
   */
  public get CRON_TIMEZONE() {
    return this._CRON_TIMEZONE;
  }

  /**
   * @description Returns the password of the crypto.
   */
  public get CRYPTO_PASSWORD() {
    return this._CRYPTO_PASSWORD;
  }

  /**
   * @description Returns the master keys.
   */
  public get MASTER_KEY() {
    return this._MASTER_KEY;
  }

  /**
   * @description Returns the secret of the Json Web Token.
   */
  public get JWT_SECRET() {
    return this._JWT_SECRET;
  }

  /**
   * @description Returns the secret of the cookies.
   */
  public get COOKIE_SECRET() {
    return this._COOKIE_SECRET;
  }

  /**
   * @description Returns the secret of the sessions.
   */
  public get SESSION_SECRET() {
    return this._SESSION_SECRET;
  }

  /**
   * @description Returns the uri of the axios requests.
   */
  public get AXIOS_URI() {
    return this._AXIOS_URI;
  }

  /**
   * @description Returns the authorization of the axios requests.
   */
  public get AXIOS_AUTHORIZATION() {
    return this._AXIOS_AUTHORIZATION;
  }

  /**
   * @description Returns the access key id of the aws.
   */
  public get AWS_ACCESS_KEY_ID() {
    return this._AWS_ACCESS_KEY_ID;
  }

  /**
   * @description Returns the secret of the access key in aws.
   */
  public get AWS_SECRET_ACCESS_KEY() {
    return this._AWS_SECRET_ACCESS_KEY;
  }

  /**
   * @description Returns the host of the smtp.
   */
  public get SMTP_HOST() {
    return this._SMTP_HOST;
  }

  /**
   * @description Returns the port of the smtp.
   */
  public get SMTP_PORT() {
    return this._SMTP_PORT;
  }

  /**
   * @description Returns the secure of the smtp.
   */
  public get SMTP_SECURE() {
    return this._SMTP_SECURE;
  }

  /**
   * @description Returns the username of the smtp.
   */
  public get SMTP_USERNAME() {
    return this._SMTP_USERNAME;
  }

  /**
   * @description Returns the password of the smtp.
   */
  public get SMTP_PASSWORD() {
    return this._SMTP_PASSWORD;
  }

  /**
   * @description Check if the environment is development.
   */
  public get isDev(): boolean {
    return String(this.NODE_ENV).toLowerCase() === 'development';
  }

  /**
   * @description Check if the environment is production.
   */
  public get isProd(): boolean {
    return String(this.NODE_ENV).toLowerCase() === 'production';
  }

  /**
   * @description Check if the environment is test.
   */
  public get isTest(): boolean {
    return String(this.NODE_ENV).toLowerCase() === 'test';
  }

  /**
   * @description Returns the mongoDB configuration.
   */
  public get mongoDB(): {
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

  /**
   * @description Returns the redis configuration.
   */
  public get redis(): { host: string; port: number; password: string } {
    return {
      host: this.REDIS_HOST,
      port: this.REDIS_PORT,
      password: this.REDIS_PASSWORD,
    };
  }

  /**
   * @description Returns the bull board configuration.
   */
  public get bullBoard(): { username: string; password: string } {
    return {
      username: this.BULL_BOARD_USERNAME,
      password: this.BULL_BOARD_PASSWORD,
    };
  }

  /**
   * @description Returns the secrets of the application (crypto, master key,  jwt, cookie, session).
   */
  public get secrets(): {
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

  /**
   * @description Returns the axios configuration.
   */
  public get axios(): { uri: string; authorization: string } {
    return {
      uri: this.AXIOS_URI,
      authorization: this.AXIOS_AUTHORIZATION,
    };
  }

  /**
   * @description Returns the aws configuration.
   */
  public get aws(): { accessKeyId: string; secretAccessKey: string } {
    return {
      accessKeyId: this.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
    };
  }

  /**
   * @description Returns the smtp configuration.
   */
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
