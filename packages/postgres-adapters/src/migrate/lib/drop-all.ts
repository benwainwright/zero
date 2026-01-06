import { NO_MIGRATIONS } from 'kysely';
import { type ConnectConfig } from './connect.ts';
import { migrator as getMigrator } from './migrator.ts';
import { logResults } from './log-results.ts';

export const dropAllMigrations = async (config: ConnectConfig) => {
  await using migrator = await getMigrator(config);

  const result = await migrator.migrateTo(NO_MIGRATIONS);

  logResults(result);
};
