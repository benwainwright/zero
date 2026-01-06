import { Migrator, FileMigrationProvider } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import { connect, type ConnectConfig } from './connect.ts';
const migrationFolder = path.join(__dirname, '../migrations');

export const runMigrations = async (config: ConnectConfig) => {
  const db = connect(config);
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  await migrator.migrateToLatest();
};
