import type { IKyselyDataSource } from '@zero/kysely-shared';
import { logResults } from './log-results.ts';
import { migrator as getMigrator } from './migrator.ts';
import type { DB } from '@core';

export const runMigrations = async (sqlite: IKyselyDataSource<DB>) => {
  const migrator = await getMigrator(sqlite);

  const result = await migrator.migrateToLatest();

  logResults(result);
};
