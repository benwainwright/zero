import { Migrator, FileMigrationProvider } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import type { IKyselyDataSource } from '@zero/kysely-shared';
import type { DB } from '@core';
const migrationFolder = path.join(__dirname, '../migrations');

export const migrator = async (sqlite: IKyselyDataSource<DB>) => {
  const migrator = new Migrator({
    db: await sqlite.get(),
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  return migrator;
};
