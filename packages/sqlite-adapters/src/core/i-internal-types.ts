import type { ConfigValue } from '@zero/bootstrap';
import type { SqliteDatabase } from './sqlite-database.ts';

export interface IInternalTypes {
  SqliteDatabase: SqliteDatabase;
  DatabaseFilename: ConfigValue<string>;
  DatabaseTablePrefix: ConfigValue<string>;
}
