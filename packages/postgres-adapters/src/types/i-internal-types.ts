import type { ConfigValue } from '@zero/bootstrap';
import type { PostgresConnectionPool } from '../core/postgress-connection-pool.ts';

export interface IInternalTypes {
  PostgresCaBundlePath: ConfigValue<string | undefined>;
  PostgresRejectUnauthorised: ConfigValue<boolean | undefined>;
  PostgresDatabaseName: ConfigValue<string>;
  PostgresDatabaseHost: ConfigValue<string>;
  PostgresDatabasePassword: ConfigValue<string>;
  PostgresDatabasePort: ConfigValue<number>;
  PostgressUsername: ConfigValue<string>;
  PostgresConnectionPool: PostgresConnectionPool;
}
