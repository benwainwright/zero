import { type IAuthTypes } from '@zero/auth';
import { module } from '@zero/bootstrap';
import type { IInternalTypes } from './i-internal-types.ts';
import * as z from 'zod';
import { SqliteDatabase } from './sqlite-database.ts';
import { SqliteRepositoryAdapter } from '@adapters';
import type { IApplicationTypes } from '@zero/application-core';

export const CONFIG_NAMESPACE = 'sqlite';

export const sqliteAdaptersModule = module<
  IAuthTypes & IInternalTypes & IApplicationTypes
>(({ load, bootstrapper }) => {
  const tablePrefix = bootstrapper.configValue({
    namespace: CONFIG_NAMESPACE,
    key: 'tablePrefix',
    schema: z.string(),
    description: 'String that will be prefixed before sqlite table names',
  });

  const databaseFilename = bootstrapper.configValue({
    namespace: CONFIG_NAMESPACE,
    key: 'filename',
    schema: z.string(),
    description: 'Name and path of the sqlite file',
  });

  load.bind('DatabaseTablePrefix').toConstantValue(tablePrefix);
  load.bind('UserRepository').to(SqliteRepositoryAdapter);
  load.bind('DatabaseFilename').toConstantValue(databaseFilename);
  load.bind('RoleRepository').to(SqliteRepositoryAdapter);
  load.bind('SqliteDatabase').to(SqliteDatabase).inSingletonScope();
  load.bind('UnitOfWork').toService('SqliteDatabase');
});
