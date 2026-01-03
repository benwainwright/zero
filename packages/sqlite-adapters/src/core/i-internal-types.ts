import type { ConfigValue } from '@zero/bootstrap';
import type { SqliteDatabase } from './sqlite-database.ts';
import type { SqliteRepositoryAdapter } from '@adapters';

export interface IInternalTypes {
  SqliteDatabase: SqliteDatabase;
  SqliteRepoAdapter: SqliteRepositoryAdapter;
  DatabaseFilename: ConfigValue<string>;
  DatabaseTablePrefix: ConfigValue<string>;
}
