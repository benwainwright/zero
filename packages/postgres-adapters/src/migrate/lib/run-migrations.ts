import { type ConnectConfig } from './connect.ts';
import { logResults } from './log-results.ts';
import { migrator as getMigrator } from './migrator.ts';

import waitPort from 'wait-port';

export const runMigrations = async (config: ConnectConfig) => {
  await waitPort({ host: 'localhost', port: 5433 });
  const migrator = await getMigrator(config);

  const result = await migrator.migrateToLatest();

  await migrator.close();

  logResults(result);
};
