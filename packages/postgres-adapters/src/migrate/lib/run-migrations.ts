import { type ConnectConfig } from './connect.ts';
import { logResults } from './log-results.ts';
import { migrator as getMigrator } from './migrator.ts';

export const runMigrations = async (config: ConnectConfig) => {
  const migrator = await getMigrator(config);

  const result = await migrator.migrateToLatest();

  await migrator.close();

  logResults(result);
};
