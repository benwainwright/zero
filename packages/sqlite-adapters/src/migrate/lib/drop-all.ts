import { NO_MIGRATIONS } from 'kysely';
import { migrator as getMigrator } from './migrator.ts';
import { logResults } from './log-results.ts';
import type { DB } from '@core';
import type { IKyselyDataSource } from '@zero/kysely-shared';

export const dropAllMigrations = async (sqlite: IKyselyDataSource<DB>) => {
  const migrator = await getMigrator(sqlite);

  const result = await migrator.migrateTo(NO_MIGRATIONS);

  logResults(result);
};
