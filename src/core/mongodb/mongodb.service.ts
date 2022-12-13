import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { connection, connect } from 'mongoose';
import { Pino } from '@/core/libs/pino';
import MongoDbURL from '@/core/common/functions/MongoDbURL';

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
export class MongoDBService implements OnModuleInit {
  private _mongoConfig: Config;
  private readonly pino: Pino;

  constructor() {
    this.pino = new Pino({
      colorize: true,
    });
  }

  async onModuleInit() {
    await this._initialize();
  }

  private async _initialize() {
    await this._connectionConfig();
    await this._connectionLogs();
    await this._connectionClose();
    this._connectionOpen();
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

  private async _connectionConfig() {
    this._mongoConfig = {
      username: process.env.MONGODB_USERNAME || '',
      password: process.env.MONGODB_PASSWORD || '',
      host: process.env.MONGODB_HOST || '',
      port: process.env.MONGODB_PORT || '27017',
      database: process.env.MONGODB_NAME || '',
      connection: {
        ssl: eval(process.env.MONGODB_CONNECTION_SSL || 'false'),
      },
      project: {
        name: process.env.MONGODB_PROJECT_NAME || '',
      },
    };
  }

  private async _connectionLogs() {
    const pino = this.pino;

    connection.on('connected', function () {
      pino.info({}, 'Mongoose default connection is open');
    });

    connection.on('error', function (err) {
      pino.error({}, `Mongoose default connection has occurred ${err} error`);
    });

    connection.on('disconnected', function () {
      pino.warn({}, 'Mongoose default connection is disconnected');
    });

    connection.on('open', function () {
      pino.info({}, 'Mongoose default connection is open');
    });
  }

  private async _connectionClose() {
    const pino = this.pino;

    const gracefulExit = function () {
      connection.close(function (error) {
        if (error) {
          return pino.error(
            error,
            `Mongoose default connection has occurred error`,
          );
        }

        if (connection.readyState == 0) {
          return pino.info({}, 'Mongoose default connection is disconnected');
        }

        process.exit(0);
      });
    };

    process.on('SIGINT', gracefulExit.bind(this));
    process.on('SIGTERM', gracefulExit.bind(this));
  }

  private _connectionOpen() {
    const pino = this.pino;

    return connect(
      this._uri(),
      {
        autoIndex: true,
        autoCreate: true,
      },
      (err) => {
        if (err) {
          connection.close(true);

          return pino.info(
            err,
            'Mongoose default connection is disconnected due to error',
          );
        }

        return pino.info({}, 'Mongoose default connection is open');
      },
    );
  }

  public getDB(dbName: string) {
    return connection.getClient().db(dbName);
  }

  public shutdown(app: INestApplication) {
    const pino = this.pino;

    return connection.close(async function (error) {
      if (error) {
        return pino.error(
          error,
          `Mongoose default connection has occurred error`,
        );
      }

      if (connection.readyState == 0) {
        return pino.info({}, 'Mongoose default connection is disconnected');
      }

      await app.close();
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    return this.shutdown(app);
  }
}
