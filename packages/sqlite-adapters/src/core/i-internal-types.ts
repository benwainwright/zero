import type { ConfigValue } from '@zero/bootstrap';
import type { KyselySqliteDatabase } from './kysely-sqlite-database.ts';

export interface IInternalTypes {
  DatabaseFilename: ConfigValue<string>;
  DatabaseTablePrefix: ConfigValue<string>;
  KyselySqliteDatabase: KyselySqliteDatabase;
}
