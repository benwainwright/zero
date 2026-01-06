import { Migrator, FileMigrationProvider } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import { connect, type ConnectConfig } from './connect.ts';
const migrationFolder = path.join(__dirname, '../migrations');

export const migrator = async (config: ConnectConfig) => {
  const db = await connect(config);
  const migrator = new Migrator({
    db: await db.get(),
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  return Object.assign(migrator, {
    [Symbol.asyncDispose]: async () => {
      await db.close();
    },
  });
};
