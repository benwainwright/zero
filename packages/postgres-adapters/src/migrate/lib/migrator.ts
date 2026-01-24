import { Migrator, FileMigrationProvider } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import { connect, type ConnectConfig } from './connect.ts';
import { PostgresConnectionPool } from '@core';
const migrationFolder = path.join(__dirname, '../migrations');

export const migrator = async (
  config: ConnectConfig | PostgresConnectionPool
) => {
  const db =
    config instanceof PostgresConnectionPool ? config : await connect(config);
  const migrator = new Migrator({
    db: await db.get(),
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  return Object.assign(migrator, {
    close: async () => {
      await db.close();
    },
  });
};
