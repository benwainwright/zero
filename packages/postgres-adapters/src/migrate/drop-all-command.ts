import { command, string, number } from '@drizzle-team/brocli';
import { dropAllMigrations } from './lib/drop-all.ts';

export const dropAllCommand = command({
  name: 'drop-all',
  options: {
    host: string(),
    port: number(),
    user: string(),
    password: string(),
    database: string(),
  },

  handler: async (opts) => {
    await dropAllMigrations(opts);
  },
});
