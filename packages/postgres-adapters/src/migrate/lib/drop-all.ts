import { NO_MIGRATIONS } from 'kysely';
import { type ConnectConfig } from './connect.ts';
import { migrator as getMigrator } from './migrator.ts';
import { logResults } from './log-results.ts';
import { PostgresConnectionPool } from '@core';

export const dropAllMigrations = async (
  config: ConnectConfig | PostgresConnectionPool
) => {
  const migrator = await getMigrator(config);

  const result = await migrator.migrateTo(NO_MIGRATIONS);

  logResults(result);
  if (!(config instanceof PostgresConnectionPool)) {
    await migrator.close();
  }
};
