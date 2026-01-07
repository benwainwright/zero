import { type IAuthTypes } from '@zero/auth';
import { type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from './i-internal-types.ts';
import * as z from 'zod';
import { SqliteDatabase } from './sqlite-database.ts';
import type { IApplicationTypes } from '@zero/application-core';
import {
  SqliteBankConnectionRepository,
  SqliteOauthTokenRepository,
  SqliteRoleRepository,
  SqliteSyncDetailsRepository,
  SqliteTransactionRepository,
  SqliteUserRepository,
} from '@adapters';
import type { IAccountsTypes } from '@zero/accounts';

export const CONFIG_NAMESPACE = 'sqlite';

export const sqliteAdaptersModule: IModule<
  IAuthTypes & IInternalTypes & IApplicationTypes & IAccountsTypes
> = async ({ bind, configValue }) => {
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
  bind('UserRepository').to(SqliteUserRepository);
  bind('RoleRepository').to(SqliteRoleRepository);
  bind('BankConnectionRepository').to(SqliteBankConnectionRepository);
  bind('TransactionRepository').to(SqliteTransactionRepository);
  bind('OauthTokenRepository').to(SqliteOauthTokenRepository);
  bind('SyncDetailsRepository').to(SqliteSyncDetailsRepository);
  bind('DatabaseFilename').toConstantValue(databaseFilename);
  bind('SqliteDatabase').to(SqliteDatabase).inSingletonScope();
  bind('UnitOfWork').toService('SqliteDatabase');
};
