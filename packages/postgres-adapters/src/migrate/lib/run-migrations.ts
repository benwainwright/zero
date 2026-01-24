import { PostgresConnectionPool } from '@core';
import { type ConnectConfig } from './connect.ts';
import { logResults } from './log-results.ts';
import { migrator as getMigrator } from './migrator.ts';

export const runMigrations = async (
  config: ConnectConfig | PostgresConnectionPool
) => {
  const migrator = await getMigrator(config);

  const result = await migrator.migrateToLatest();

  if (!(config instanceof PostgresConnectionPool)) {
    await migrator.close();
  }

  logResults(result);
};
