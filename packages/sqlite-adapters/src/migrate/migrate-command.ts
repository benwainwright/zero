import { command, string } from '@drizzle-team/brocli';
import { runMigrations } from './lib/run-migrations.ts';
import { KyselySqliteDatabase } from '@core';
import { ConfigValue } from '@zero/bootstrap';

export const migrateCommand = command({
  name: 'migrate',
  options: {
    file: string().required(),
  },

  handler: async (opts) => {
    const sqlite = new KyselySqliteDatabase(
      new ConfigValue(Promise.resolve(opts.file))
    );
    await runMigrations(sqlite);
  },
});
