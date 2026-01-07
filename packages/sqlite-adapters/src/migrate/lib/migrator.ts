import { Migrator, FileMigrationProvider, SqliteDialect, Kysely } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import SQLite from 'better-sqlite3';
import { type ConnectConfig } from './connect.ts';
const migrationFolder = path.join(__dirname, '../migrations');

export const migrator = async () => {
  const dialect = new SqliteDialect({
    database: new SQLite(':memory:'),
  });
  const db = new Kysely({
    dialect,
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  return migrator;
};
