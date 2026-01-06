import { command, string, number, run } from '@drizzle-team/brocli';
import { runMigrations } from './lib/run-migrations.ts';

await run([
  command({
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
  }),
]);
