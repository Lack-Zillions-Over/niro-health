import { Database } from 'sqlite3';

export interface ISqliteService {
  db: Database;
}
