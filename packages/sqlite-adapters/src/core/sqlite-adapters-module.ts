import { type IAuthTypes } from '@zero/auth';
import { type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from './i-internal-types.ts';
import * as z from 'zod';
import type { IApplicationTypes } from '@zero/application-core';
import {
  SqliteAccountsRepository,
  SqliteBankConnectionRepository,
  SqliteOauthTokenRepository,
  SqliteRoleRepository,
  SqliteSyncDetailsRepository,
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
  bind('AccountRepository').to(SqliteAccountsRepository);
  bind('BankConnectionRepository').to(SqliteBankConnectionRepository);
  bind('TransactionRepository').to(SqliteTransactionRepository);
  bind('OauthTokenRepository').to(SqliteOauthTokenRepository);
  bind('SyncDetailsRepository').to(SqliteSyncDetailsRepository);
  bind('DatabaseFilename').toConstantValue(databaseFilename);
  bind('UnitOfWork').to(KyselyUnitOfWork).inRequestScope();
  bind('KyselyTransactionManager').toService('UnitOfWork');
  bind('KyselyDataSource').to(KyselySqliteDatabase).inSingletonScope();
};
