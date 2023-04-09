import { Injectable } from '@nestjs/common';
import { Database } from 'sqlite3';
import { Sqlite } from '@app/sqlite/sqlite.interface';
import { ConfigurationService } from '@app/configuration';

@Injectable()
export class SqliteService implements Sqlite.Class {
  private _db: Database;

  constructor(private readonly configurationService: ConfigurationService) {
    this._db = new Database(`${this._dbName}.sqlite`);
  }

  private get _dbName() {
    return this.configurationService.getVariable('sqlite_dbname') ?? 'memory';
  }

  get db() {
    return this._db;
  }
}
