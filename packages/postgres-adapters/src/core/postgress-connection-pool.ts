import { injectable, postConstruct } from 'inversify';
import type { ConfigValue, ILogger } from '@zero/bootstrap';
import type { IKyselyDataSource } from '@zero/kysely-shared';
import { Pool } from 'pg';
import { inject } from './typed-inject.ts';

import { sql, Kysely, PostgresDialect } from 'kysely';
import type { DB } from './database.ts';
import { wait } from './wait.ts';
import { readFile } from 'fs/promises';

@injectable()
export class PostgresConnectionPool implements IKyselyDataSource<DB> {
  public constructor(
    @inject('PostgresDatabaseName')
    private readonly databaseName: ConfigValue<string>,

    @inject('PostgresDatabaseHost')
    private readonly databaseHost: ConfigValue<string>,

    @inject('PostgresDatabasePassword')
    private readonly databasePassword: ConfigValue<string>,

    @inject('PostgressUsername')
    private readonly databaseUsername: ConfigValue<string>,

    @inject('PostgresDatabasePort')
    private readonly databasePort: ConfigValue<number>,

    @inject('PostgresCaBundlePath')
    private readonly caBundlePath: ConfigValue<string | undefined>,

    @inject('PostgresRejectUnauthorised')
    private readonly rejectUnauthorised: ConfigValue<boolean | undefined>,

    @inject('Logger')
    private readonly logger: ILogger
  ) {}

  private connection: Kysely<DB> | undefined;
  private pool: Pool | undefined;
  private connected = false;

  public async dropTables() {
    if (process.env['NODE_ENV'] === 'production') {
      throw new Error(`Cannot drop tables in production`);
    }

    const connection = await this.get();

    const cx = await connection.startTransaction().execute();

    await sql`DROP TABLE IF EXISTS
      public.user_roles,
      public.users,
      public.roles
    CASCADE;`.execute(cx);

    await cx.commit().execute();
  }

  public async doConnect() {
    this.logger.info(`Connecting to database!`);
    const db = await this.databaseName.value;

    const caBundlePath = await this.caBundlePath.value;

    const withTls = caBundlePath
      ? {
          ssl: {
            rejectUnauthorised: Boolean(this.rejectUnauthorised),
            ca: (await readFile(caBundlePath, 'utf8')).toString(),
          },
        }
      : {};

    if (!this.pool) {
      this.pool = new Pool({
        database: db,
        host: await this.databaseHost.value,
        port: await this.databasePort.value,
        password: await this.databasePassword.value,
        user: await this.databaseUsername.value,
        connectionTimeoutMillis: 5_000,
        idleTimeoutMillis: 10_000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10_000,
        ...withTls,
      });

      this.logger.info(`Connection initialised`);

      this.pool.on('error', (error) => {
        this.logger.error(error.message, { error });
      });
    }
  }

  @postConstruct()
  public async initialise() {
    try {
      await this.doConnect();
      await this.waitForDb();

      if (this.pool) {
        this.logger.info(`Creating database if it doesnt already exist`);
        this.connection = new Kysely<DB>({
          dialect: new PostgresDialect({
            pool: this.pool,
          }),
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async waitForDb() {
    const maxAttempts = 10;
    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      try {
        // ensure pool exists
        const client = await this.pool?.connect();
        try {
          await client?.query('select 1');
          this.connected = true;
          return;
        } finally {
          client?.release();
        }
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'code' in error &&
          typeof error.code === 'string'
        ) {
          const retryable =
            error?.code === 'ECONNRESET' ||
            error?.code === 'ETIMEDOUT' ||
            error?.code === 'ECONNREFUSED';

          if (!retryable || attempt === maxAttempts) {
            throw error;
          }
          await wait(200 * attempt);
          continue;
        }
        throw error;
      }
    }
  }

  public async close() {
    try {
      await this.connection?.destroy();
      await this.pool?.end();
    } catch {
      // NOOp
    } finally {
      this.connected = false;
      this.connection = undefined;
      this.pool = undefined;
    }
  }

  public async get() {
    while (!this.connected) {
      await wait(10);
    }

    if (!this.connection) {
      throw new Error(`No connection found!`);
    }

    return this.connection;
  }
}
