import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export interface ConnectConfig {
  host?: string | undefined;
  port?: number | undefined;
  user?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
}

export const connect = ({
  host,
  port,
  user,
  password,
  database,
}: ConnectConfig) => {
  const pool = new Pool({
    database,
    host,
    port,
    user,
    password,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 10_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  });

  return new Kysely({
    dialect: new PostgresDialect({
      pool,
    }),
  });
};
