import { PostgresRepositoryAdapter } from '@adapters';
import type { IApplicationTypes } from '@zero/application-core';
import type { IAuthTypes } from '@zero/auth';
import { type IModule } from '@zero/bootstrap';
import { PostgressDatabase } from './postgres-database.ts';
import type { IInternalTypes } from '../types/i-internal-types.ts';
import z from 'zod';
import { PostgresConnectionPool } from './postgress-connection-pool.ts';

export const postgresAdaptersModule: IModule<
  IApplicationTypes & IAuthTypes & IInternalTypes
> = async ({ logger, configValue, bind }) => {
  logger.info(`Initialising postgres module`);
  const host = configValue({
    namespace: 'postgres',
    key: 'host',
    description: 'The hostname of the postgres instance',
    schema: z.string(),
  });

  const databaseName = configValue({
    namespace: 'postgres',
    key: 'databaseName',
    description: 'The name of the database within the postgres instance',
    schema: z.string(),
  });

  const port = configValue({
    namespace: 'postgres',
    key: 'port',
    description: 'The port that the postgres server will be available on',
    schema: z.number(),
  });

  const databasePassword = configValue({
    namespace: 'postgres',
    key: 'password',
    description: 'Password used to connect to the postgres instance',
    schema: z.string(),
  });

  const databaseUser = configValue({
    namespace: 'postgres',
    key: 'user',
    description: 'The username used to connect to the postgres instance',
    schema: z.string(),
  });

  bind('UserRepository').to(PostgresRepositoryAdapter).inRequestScope();
  bind('RoleRepository').to(PostgresRepositoryAdapter).inRequestScope();
  bind('PostgresDatabase').to(PostgressDatabase).inRequestScope();
  bind('UnitOfWork').toService('PostgresDatabase');
  bind('PostgressUsername').toConstantValue(databaseUser);
  bind('PostgresDatabaseHost').toConstantValue(host);
  bind('PostgresDatabaseName').toConstantValue(databaseName);
  bind('PostgresDatabasePassword').toConstantValue(databasePassword);
  bind('PostgresDatabasePort').toConstantValue(port);
  bind('PostgresConnectionPool').to(PostgresConnectionPool).inSingletonScope();
};
