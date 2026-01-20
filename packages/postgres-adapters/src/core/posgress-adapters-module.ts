import {
  PostgresAccountRepository,
  PostgresOauthTokenRepository,
  PostgresRoleRepository,
  PostgressCategoryRepository,
  PostgresTransactionRepository,
  PostgresUserRepository,
} from '@adapters';
import { eventStager, type IApplicationTypes } from '@zero/application-core';
import type { IAuthTypes } from '@zero/auth';
import { type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from '../types/i-internal-types.ts';
import z from 'zod';
import { PostgresConnectionPool } from './postgress-connection-pool.ts';
import type { IAccountsTypes } from '@zero/accounts';
import { KyselyUnitOfWork, type IKyselySharedTypes } from '@zero/kysely-shared';
import type { DB } from './database.ts';

export const postgresAdaptersModule: IModule<
  IApplicationTypes &
    IAuthTypes &
    IInternalTypes &
    IAccountsTypes &
    IKyselySharedTypes<DB>
> = async ({ logger, configValue, bind, decorate }) => {
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

  const stager = eventStager<IAuthTypes & IAccountsTypes & IApplicationTypes>();

  bind('UserRepository').to(PostgresUserRepository).inRequestScope();
  bind('UserWriter').to(PostgresUserRepository).inRequestScope();
  decorate('UserWriter', stager('UserWriter'));

  bind('RoleRepository').to(PostgresRoleRepository).inRequestScope();
  bind('RoleWriter').to(PostgresRoleRepository).inRequestScope();
  decorate('RoleWriter', stager('RoleWriter'));

  bind('AccountRepository').to(PostgresAccountRepository).inRequestScope();
  bind('AccountWriter').to(PostgresAccountRepository).inRequestScope();
  decorate('AccountWriter', stager('AccountWriter'));

  bind('OauthTokenRepository')
    .to(PostgresOauthTokenRepository)
    .inRequestScope();
  bind('OauthTokenWriter').to(PostgresOauthTokenRepository).inRequestScope();
  decorate('OauthTokenWriter', stager('OauthTokenWriter'));

  bind('TransactionRepository')
    .to(PostgresTransactionRepository)
    .inRequestScope();

  bind('TransactionWriter').to(PostgresTransactionRepository).inRequestScope();
  decorate('TransactionWriter', stager('TransactionWriter'));

  bind('CategoryRepository').to(PostgressCategoryRepository).inRequestScope();
  bind('CategoryWriter').to(PostgressCategoryRepository).inRequestScope();
  decorate('CategoryWriter', stager('CategoryWriter'));

  bind('PostgressUsername').toConstantValue(databaseUser);
  bind('PostgresDatabaseHost').toConstantValue(host);
  bind('PostgresDatabaseName').toConstantValue(databaseName);
  bind('PostgresDatabasePassword').toConstantValue(databasePassword);
  bind('PostgresDatabasePort').toConstantValue(port);
  bind('UnitOfWork').to(KyselyUnitOfWork).inRequestScope();
  bind('KyselyTransactionManager').toService('UnitOfWork');
  bind('KyselyDataSource').to(PostgresConnectionPool).inSingletonScope();
  bind('PostgresConnectionPool').toService('KyselyDataSource');
};
