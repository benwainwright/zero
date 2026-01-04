import { type IAuthTypes } from '@zero/auth';
import { type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from './i-internal-types.ts';
import * as z from 'zod';
import { SqliteDatabase } from './sqlite-database.ts';
import { SqliteRepositoryAdapter } from '@adapters';
import type { IApplicationTypes } from '@zero/application-core';

export const CONFIG_NAMESPACE = 'sqlite';

export const sqliteAdaptersModule: IModule<
  IAuthTypes & IInternalTypes & IApplicationTypes
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
  bind('UserRepository').to(SqliteRepositoryAdapter);
  bind('DatabaseFilename').toConstantValue(databaseFilename);
  bind('RoleRepository').to(SqliteRepositoryAdapter);
  bind('SqliteDatabase').to(SqliteDatabase).inSingletonScope();
  bind('UnitOfWork').toService('SqliteDatabase');
};
