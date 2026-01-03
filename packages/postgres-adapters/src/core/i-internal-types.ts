import type { ConfigValue } from '@zero/bootstrap';
import type { PostgresConnectionPool } from './postgress-connection-pool.ts';
import type { PostgressDatabase } from './postgres-database.ts';

export interface IInternalTypes {
  PostgresDatabaseName: ConfigValue<string>;
  PostgresDatabaseHost: ConfigValue<string>;
  PostgresDatabasePassword: ConfigValue<string>;
  PostgressUsername: ConfigValue<string>;
  PostgresConnectionPool: PostgresConnectionPool;
  PostgresDatabase: PostgressDatabase;
}
