import {
  INestApplication,
  Injectable,
  OnApplicationShutdown,
  Inject,
} from '@nestjs/common';
import { Database } from 'sqlite3';

import type { ISqliteService } from '@app/core/sqlite/sqlite.interface';
import type { IDebugService } from '@app/debug';
import type { IConfigurationService } from '@app/configuration';

@Injectable()
export class SqliteService implements ISqliteService, OnApplicationShutdown {
  /**
   * @description This is instance of application.
   */
  app: INestApplication;

  /**
   * @description This is the major component of sqlite3. Use it to connect to a standalone Sqlite server or Sentinels.
   */
  private _db: Database;

  constructor(
    @Inject('IDebugService') private readonly debugService: IDebugService,
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {
    this._db = new Database(`${this._dbName}.sqlite`);
    this._connectionLogs();
  }

  /**
   * @description This method is used to log connection events.
   */
  private _connectionLogs() {
    const logger = this.debugService;

    this._db.on('open', function () {
      logger.log('Sqlite connection is open');
    });

    this._db.on('error', function (err) {
      logger.error(`Sqlite connection has occurred ${err} error`);
    });

    this._db.on('close', function () {
      logger.warn('Sqlite connection is disconnected');
    });
  }

  /**
   * @description This method is used to get database name.
   */
  private get _dbName() {
    return this.configurationService.getVariable('sqlite_dbname') ?? 'memoryDB';
  }

  /**
   * @description This method is used to get database instance.
   */
  public get db() {
    return this._db;
  }

  /**
   * @description This method is used to shutdown application.
   * @param app The application instance.
   */
  public async shutdown(app: INestApplication) {
    const logger = this.debugService;
    try {
      await this._db.close();
      logger.log('Sqlite connection is disconnected');
      await app.close();
    } catch (error) {
      return logger.error(error, `Sqlite connection has occurred error`);
    }
  }

  /**
   * @description This method is called before the application shutdown.
   */
  async onApplicationShutdown() {
    return await this.shutdown(this.app);
  }

  /**
   * @description This method is used to enable shutdown hooks.
   * @param app The application instance.
   */
  async enableShutdownHooks(app: INestApplication) {
    this.app = app;
  }
}
