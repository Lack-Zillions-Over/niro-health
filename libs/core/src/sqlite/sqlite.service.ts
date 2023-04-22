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
  app: INestApplication;
  private _db: Database;

  constructor(
    @Inject('IDebugService') private readonly debugService: IDebugService,
    @Inject('IConfigurationService')
    private readonly configurationService: IConfigurationService,
  ) {
    this._db = new Database(`${this._dbName}.sqlite`);
    this._connectionLogs();
  }

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

  private get _dbName() {
    return this.configurationService.getVariable('sqlite_dbname') ?? 'memoryDB';
  }

  public get db() {
    return this._db;
  }

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

  async onApplicationShutdown() {
    return await this.shutdown(this.app);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.app = app;
  }
}
