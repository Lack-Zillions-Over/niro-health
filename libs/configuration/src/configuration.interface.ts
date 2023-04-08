import { NODE_ENV } from '@app/configuration/configuration.types';

export declare namespace Configuration {
  export type ENVS = { [key: string]: string };
  export type VARIABLES = { [key: string]: string };
  export interface Class {
    get<T>(key: string): T;
    register<T>(key: string, value: T): void;
    unregister(key: string): void;
    getVariable<T>(key: string): T;
    setVariable<T>(key: string, value: T): void;
    delVariable(key: string): void;
    NODE_ENV: NODE_ENV;
    VERSION: string;
    API_URI: string;
    WEBAPP_URI: string;
    PORT: number;
    DATABASE_URL: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE_NAME: string;
    MONGODB_USERNAME: string;
    MONGODB_PASSWORD: string;
    MONGODB_HOST: string;
    MONGODB_PORT: string;
    MONGODB_NAME: string;
    MONGODB_GRIDFS_NAME: string;
    MONGODB_CONNECTION_SSL: boolean;
    MONGODB_PROJECT_NAME: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
    BULL_BOARD_USERNAME: string;
    BULL_BOARD_PASSWORD: string;
    CRON_TIMEZONE: string;
    CRYPTO_PASSWORD: string;
    MASTER_KEY: string;
    JWT_SECRET: string;
    COOKIE_SECRET: string;
    SESSION_SECRET: string;
    AXIOS_URI: string;
    AXIOS_AUTHORIZATION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    SMTP_USERNAME: string;
    SMTP_PASSWORD: string;
    ENV: NODE_ENV;
    isDev: boolean;
    isProd: boolean;
    isTest: boolean;
    mongoDB: {
      username: string;
      password: string;
      host: string;
      port: string;
      name: string;
      gridfsName: string;
      connectionSSL: boolean;
      projectName: string;
    };
    redis: {
      host: string;
      port: number;
      password: string;
    };
    bullBoard: {
      username: string;
      password: string;
    };
    secrets: {
      cryptoPassword: string;
      masterKey: string;
      jwtSecret: string;
      cookieSecret: string;
      sessionSecret: string;
    };
    axios: {
      uri: string;
      authorization: string;
    };
    aws: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      username: string;
      password: string;
    };
  }
}
