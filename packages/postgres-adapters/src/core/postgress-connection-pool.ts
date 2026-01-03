import { injectable, postConstruct } from 'inversify';
import type { ConfigValue, ILogger } from '@zero/bootstrap';
import { Pool } from 'pg';
import { inject } from './typed-inject.ts';

import { sql, Kysely, PostgresDialect } from 'kysely';
import type { Database } from './i-database.ts';

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
  private pool: Pool | undefined;

  public async dropTables() {
    if (process.env['NODE_ENV'] === 'production') {
      throw new Error(`Cannot drop tables in production`);
    }

    const cx = await this.get().startTransaction().execute();

    await sql`DROP TABLE IF EXISTS
      public.user_roles,
      public.users,
      public.roles
    CASCADE;`.execute(cx);

    await cx.commit().execute();
  }

  public async doConnect() {
    this.logger.info(`Connection to database`);
    this.pool = new Pool({
      database: await this.databaseName.value,
      host: await this.databaseHost.value,
      password: await this.databasePassword.value,
      user: await this.databaseUsername.value,
    });

    this.pool.on('error', (error) => {
      this.logger.error(error.message, { error });
    });
  }

  @postConstruct()
  public async initialise() {
    try {
      await this.doConnect();

      if (this.pool) {
        this.logger.info(`Creating database if it doesnt already exist`);
        this.connection = new Kysely<Database>({
          dialect: new PostgresDialect({
            pool: this.pool,
          }),
        });

        await this.connection.transaction().execute(async (tx) => {
          await sql`
          CREATE TABLE IF NOT EXISTS roles (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
            routes JSONB NOT NULL DEFAULT '{}'::jsonb
          );
        `.execute(tx);

          await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          "passwordHash" TEXT NOT NULL
        );
        `.execute(tx);

          await sql`
          CREATE TABLE IF NOT EXISTS user_roles (
            "userId" TEXT NOT NULL,
            "roleId" TEXT NOT NULL,
            CONSTRAINT user_roles_pkey PRIMARY KEY ("userId", "roleId"),
            CONSTRAINT user_roles_user_fk FOREIGN KEY ("userId") REFERENCES users (id) ON DELETE CASCADE,
            CONSTRAINT user_roles_role_fk FOREIGN KEY ("roleId") REFERENCES roles (id) ON DELETE CASCADE
          );
        `.execute(tx);

          await sql`CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles ("userId");`.execute(
            tx
          );

          await sql`CREATE INDEX IF NOT EXISTS user_roles_role_id_idx ON user_roles ("roleId");`.execute(
            tx
          );

          this.logger.info(`Database initialised`);
        });
      }
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
