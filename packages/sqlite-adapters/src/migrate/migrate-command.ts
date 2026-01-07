import { command, string, number } from '@drizzle-team/brocli';
import { runMigrations } from './lib/run-migrations.ts';

export const migrateCommand = command({
  name: 'migrate',
  options: {
    host: string(),
    port: number(),
    user: string(),
    password: string(),
    database: string(),
  },

  handler: async (opts) => {
    await runMigrations(opts);
  },
});
