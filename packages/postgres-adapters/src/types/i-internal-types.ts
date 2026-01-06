import type { ConfigValue } from '@zero/bootstrap';
import type { PostgresConnectionPool } from '../core/postgress-connection-pool.ts';
import type { PostgressDatabase } from '../core/postgres-database.ts';

export interface IInternalTypes {
  PostgresDatabaseName: ConfigValue<string>;
  PostgresDatabaseHost: ConfigValue<string>;
  PostgresDatabasePassword: ConfigValue<string>;
  PostgresDatabasePort: ConfigValue<number>;
  PostgressUsername: ConfigValue<string>;
  PostgresConnectionPool: PostgresConnectionPool;
  PostgresDatabase: PostgressDatabase;
}
