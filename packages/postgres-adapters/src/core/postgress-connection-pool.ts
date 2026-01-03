import { injectable, postConstruct } from 'inversify';
import type { ConfigValue, ILogger } from '@zero/bootstrap';
import { Pool } from 'pg';
import { inject } from './typed-inject.ts';

import { sql, Kysely, PostgresDialect } from 'kysely';
import type { Database } from './i-database.ts';
import { readFile } from 'fs/promises';
import { join } from 'path';

@injectable()
export class PostgresConnectionPool {
  public constructor(
    @inject('PostgresDatabaseName')
    private readonly databaseName: ConfigValue<string>,

    @inject('PostgresDatabaseHost')
    private readonly databaseHost: ConfigValue<string>,

    @inject('PostgresDatabasePassword')
    private readonly databasePassword: ConfigValue<string>,

    @inject('PostgressUsername')
    private readonly databaseUsername: ConfigValue<string>,

    @inject('Logger')
    private readonly logger: ILogger
  ) {}

  private connection: Kysely<Database> | undefined;

  @postConstruct()
  public async connectPool() {
    try {
      const pool = new Pool({
        database: await this.databaseName.value,
        host: await this.databaseHost.value,
        password: await this.databasePassword.value,
        user: await this.databaseUsername.value,
      });

      this.connection = new Kysely<Database>({
        dialect: new PostgresDialect({
          pool: pool,
        }),
      });

      const sqlString = await readFile(
        join(import.meta.dirname, 'create-table.sql'),
        'utf-8'
      );

      await this.connection.transaction().execute(async (tx) => {
        sql`${sqlString}`.execute(tx);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public get() {
    if (!this.connection) {
      throw new Error(`Database not connected`);
    }

    return this.connection;
  }
}
