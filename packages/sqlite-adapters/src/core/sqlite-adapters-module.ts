import { type IAuthTypes } from '@zero/auth';
import { type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from './i-internal-types.ts';
import * as z from 'zod';
import { eventStager, type IApplicationTypes } from '@zero/application-core';
import {
  SqliteAccountsRepository,
  SqliteCategoryRepository,
  SqliteOauthTokenRepository,
  SqliteRoleRepository,
  SqliteTransactionRepository,
  SqliteUserRepository,
} from '@adapters';
import type { IAccountsTypes } from '@zero/accounts';
import { KyselyUnitOfWork, type IKyselySharedTypes } from '@zero/kysely-shared';
import { KyselySqliteDatabase } from './kysely-sqlite-database.ts';
import type { DB } from '@core';

export const CONFIG_NAMESPACE = 'sqlite';

export const sqliteAdaptersModule: IModule<
  IAuthTypes &
    IInternalTypes &
    IApplicationTypes &
    IAccountsTypes &
    IKyselySharedTypes<DB>
> = async ({ bind, configValue, decorate }) => {
  const tablePrefix = configValue({
    namespace: CONFIG_NAMESPACE,
    key: 'tablePrefix',
    schema: z.string(),
    description: 'String that will be prefixed before sqlite table names',
  });

  const databaseFilename = configValue({
    namespace: CONFIG_NAMESPACE,
    key: 'filename',
    schema: z.string(),
    description: 'Name and path of the sqlite file',
  });

  bind('DatabaseTablePrefix').toConstantValue(tablePrefix);

  const stager = eventStager<IAuthTypes & IAccountsTypes & IApplicationTypes>();

  bind('UserRepository').to(SqliteUserRepository);
  bind('UserWriter').to(SqliteUserRepository);
  decorate('UserWriter', stager('UserWriter'));

  bind('RoleRepository').to(SqliteRoleRepository);
  bind('RoleWriter').to(SqliteRoleRepository);
  decorate('RoleWriter', stager('RoleWriter'));

  bind('AccountRepository').to(SqliteAccountsRepository);
  bind('AccountWriter').to(SqliteAccountsRepository);
  decorate('AccountWriter', stager('AccountWriter'));

  bind('TransactionRepository').to(SqliteTransactionRepository);
  bind('TransactionWriter').to(SqliteTransactionRepository);
  decorate('TransactionWriter', stager('TransactionWriter'));

  bind('OauthTokenRepository').to(SqliteOauthTokenRepository);
  bind('OauthTokenWriter').to(SqliteOauthTokenRepository);
  decorate('OauthTokenWriter', stager('OauthTokenWriter'));

  bind('CategoryRepository').to(SqliteCategoryRepository);
  bind('CategoryWriter').to(SqliteCategoryRepository);
  decorate('CategoryWriter', stager('CategoryWriter'));

  bind('DatabaseFilename').toConstantValue(databaseFilename);
  bind('UnitOfWork').to(KyselyUnitOfWork).inRequestScope();

  bind('KyselyTransactionManager').toService('UnitOfWork');
  bind('KyselyDataSource').to(KyselySqliteDatabase).inSingletonScope();
};
