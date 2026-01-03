import { PostgresRepositoryAdapter } from '@adapters';
import type { IApplicationTypes } from '@zero/application-core';
import type { IAuthTypes } from '@zero/auth';
import { module } from '@zero/bootstrap';
import { PostgressDatabase } from './postgres-database.ts';
import type { IInternalTypes } from '../types/i-internal-types.ts';
import z from 'zod';
import { PostgresConnectionPool } from './postgress-connection-pool.ts';

export const postgresAdaptersModule = module<
  IApplicationTypes & IAuthTypes & IInternalTypes
>(({ load, bootstrapper, logger }) => {
  logger.info(`Initialising postgres module`);
  const host = bootstrapper.configValue({
    namespace: 'postgres',
    key: 'host',
    description: 'The hostname of the postgres instance',
    schema: z.string(),
  });

  const databaseName = bootstrapper.configValue({
    namespace: 'postgres',
    key: 'databaseName',
    description: 'The name of the database within the postgres instance',
    schema: z.string(),
  });

  const databasePassword = bootstrapper.configValue({
    namespace: 'postgres',
    key: 'password',
    description: 'Password used to connect to the postgres instance',
    schema: z.string(),
  });

  const databaseUser = bootstrapper.configValue({
    namespace: 'postgres',
    key: 'user',
    description: 'The username used to connect to the postgres instance',
    schema: z.string(),
  });

  load.bind('UserRepository').to(PostgresRepositoryAdapter).inRequestScope();
  load.bind('RoleRepository').to(PostgresRepositoryAdapter).inRequestScope();
  load.bind('PostgresDatabase').to(PostgressDatabase).inRequestScope();
  load.bind('UnitOfWork').toService('PostgresDatabase');
  load.bind('PostgressUsername').toConstantValue(databaseUser);
  load.bind('PostgresDatabaseHost').toConstantValue(host);
  load.bind('PostgresDatabaseName').toConstantValue(databaseName);
  load.bind('PostgresDatabasePassword').toConstantValue(databasePassword);
  load
    .bind('PostgresConnectionPool')
    .to(PostgresConnectionPool)
    .inSingletonScope();
});
