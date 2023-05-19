import {
  INestApplication,
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import { connection, connect } from 'mongoose';

import { MongoDbURL } from '@app/core/common/functions/MongoDbURL';
import type {
  Config,
  IMongoDBService,
} from '@app/core/mongodb/mongodb.interface';
import type { IDebugService } from '@app/debug';
import type { IConfigurationService } from '@app/configuration';

/**
 * @description This service is responsible for connecting to the MongoDB database.
 */
@Injectable()
export class MongoDBService
  implements IMongoDBService, OnModuleInit, OnApplicationShutdown
{
  /**
   * @description The application instance.
   */
  public app: INestApplication;

  /**
   * @description The MongoDB configuration.
   */
  private _mongoConfig: Config;

  constructor(
    @Inject('IDebugService') private readonly debugService: IDebugService,
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {}

  /**
   * @description Initialize the module.
   */
  public async onModuleInit() {
    await this._initialize();
  }

  /**
   * @description Initialize the MongoDB connection.
   */
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

  /**
   * @description Create the MongoDB connection URI.
   */
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

  /**
   * @description MongoDB connection logs.
   */
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

  /**
   * @description MongoDB connection close.
   */
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

  /**
   * @description MongoDB connection open.
   */
  private async _connectionOpen() {
    const logger = this.debugService;

    const _connect = await connect(this._uri());

    logger.log('Mongoose default connection is open');

    return _connect;
  }

  /**
   * @description Create a new Db instance sharing the current socket connections.
   * @param dbName The name of the database we want to use. If not provided, use database name from connection string.
   */
  public getDB(dbName: string) {
    return connection.getClient().db(dbName);
  }

  /**
   * @description This method is used to shutdown application.
   * @param app The application instance.
   */
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

  /**
   * @description This method is called before the application shutdown.
   */
  public async onApplicationShutdown() {
    return await this.shutdown(this.app);
  }

  /**
   * @description This method is used to enable shutdown hooks.
   * @param app The application instance.
   */
  public async enableShutdownHooks(app: INestApplication) {
    this.app = app;
  }
}
