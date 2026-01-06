import { PostgresConnectionPool } from '@core';
import { ConfigValue, type ILogger } from '@zero/bootstrap';

export interface ConnectConfig {
  host?: string | undefined;
  port?: number | undefined;
  user?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
}

const logger: ILogger = {
  info: console.log,
  child: () => logger,
  error: console.error,
  warn: console.log,
  debug: console.log,
  verbose: console.log,
  silly: console.log,
};

export const connect = async ({
  host,
  port,
  user,
  password,
  database,
}: ConnectConfig) => {
  const pool = new PostgresConnectionPool(
    new ConfigValue(Promise.resolve(database ?? 'postgres')),
    new ConfigValue(Promise.resolve(host ?? 'localhost')),
    new ConfigValue(Promise.resolve(password ?? 'password')),
    new ConfigValue(Promise.resolve(user ?? 'postgres')),
    new ConfigValue(Promise.resolve(port ?? 5433)),
    logger
  );

  await pool.initialise();

  return pool;
};
