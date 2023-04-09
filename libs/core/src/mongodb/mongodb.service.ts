import {
  INestApplication,
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { connection, connect } from 'mongoose';

import MongoDbURL from '@app/core/common/functions/MongoDbURL';

import { DebugService } from '@app/debug';
import { ConfigurationService } from '@app/configuration';

export interface User {
  username: string;
  password: string;
}

export interface Config extends User {
  host: string;
  port: string;
  database: string;
  connection: {
    ssl: boolean;
  };
  project: {
    name: string;
  };
}

@Injectable()
export class MongoDBService implements OnModuleInit, OnApplicationShutdown {
  app: INestApplication;
  private _mongoConfig: Config;

  constructor(
    private readonly debugService: DebugService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async onModuleInit() {
    await this._initialize();
  }

  private async _initialize() {
    this._mongoConfig = {
      username: this.configurationService.mongoDB.username,
      password: this.configurationService.mongoDB.password,
      host: this.configurationService.mongoDB.host,
      port: this.configurationService.mongoDB.port,
      database: this.configurationService.mongoDB.name,
      connection: {
        ssl: this.configurationService.mongoDB.connectionSSL,
      },
      project: {
        name: this.configurationService.mongoDB.projectName,
      },
    };
    await this._connectionOpen();
    await this._connectionClose();
    await this._connectionLogs();
  }

  private _uri() {
    return MongoDbURL({
      username: this._mongoConfig.username,
      password: this._mongoConfig.password,
      host: this._mongoConfig.host,
      port: this._mongoConfig.port,
      database: this._mongoConfig.database,
      appname: this._mongoConfig.project.name,
      ssl: this._mongoConfig.connection.ssl,
    });
  }

  private async _connectionLogs() {
    const logger = this.debugService;

    connection.on('connected', function () {
      logger.log('Mongoose default connection is open');
    });

    connection.on('error', function (err) {
      logger.error(`Mongoose default connection has occurred ${err} error`);
    });

    connection.on('disconnected', function () {
      logger.warn('Mongoose default connection is disconnected');
    });

    connection.on('open', function () {
      logger.log('Mongoose default connection is open');
    });
  }

  private async _connectionClose() {
    const logger = this.debugService;

    const gracefulExit = async function () {
      try {
        await connection.close(true);
        logger.log('Mongoose default connection is disconnected');
        process.exit(0);
      } catch (error) {
        return logger.error(
          error,
          `Mongoose default connection has occurred error`,
        );
      }
    };

    process.on('SIGINT', gracefulExit.bind(this));
    process.on('SIGTERM', gracefulExit.bind(this));
  }

  private async _connectionOpen() {
    const logger = this.debugService;

    const _connect = await connect(this._uri());

    logger.log('Mongoose default connection is open');

    return _connect;
  }

  public getDB(dbName: string) {
    return connection.getClient().db(dbName);
  }

  public async shutdown(app: INestApplication) {
    const logger = this.debugService;
    try {
      await connection.close(true);
      logger.log('Mongoose default connection is disconnected');
      await app.close();
    } catch (error) {
      return logger.error(
        error,
        `Mongoose default connection has occurred error`,
      );
    }
  }

  async onApplicationShutdown() {
    return await this.shutdown(this.app);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.app = app;
  }
}
