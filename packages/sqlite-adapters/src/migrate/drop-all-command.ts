import { command, string } from '@drizzle-team/brocli';
import { dropAllMigrations } from './lib/drop-all.ts';
import { ConfigValue } from '@zero/bootstrap';
import { KyselySqliteDatabase } from '@core';

export const dropAllCommand = command({
  name: 'drop-all',
  options: {
    file: string().required(),
  },

  handler: async (opts) => {
    const sqlite = new KyselySqliteDatabase(
      new ConfigValue(Promise.resolve(opts.file))
    );
    await dropAllMigrations(sqlite);
  },
});
