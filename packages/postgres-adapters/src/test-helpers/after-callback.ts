import { type IInternalTypes } from '@core';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { dropAllMigrations } from '@migrate';
import type { IApplicationTypes } from '@zero/application-core';
import { KyselyUnitOfWork, type IKyselySharedTypes } from '@zero/kysely-shared';
import type { DB } from '../core/database.ts';

export const afterCallback = async (
  container: TypedContainer<
    IInternalTypes & IApplicationTypes & IKyselySharedTypes<DB>
  >
) => {
  await dropAllMigrations({
    host: 'localhost',
    port: 5432,
    database: 'zero',
    password: 'password',
    user: 'postgres',
  });
  await container.unbind('KyselyTransactionManager');
  await container.unbind('UnitOfWork');
  container
    .bind('KyselyTransactionManager')
    .to(KyselyUnitOfWork)
    .inRequestScope();
  container.bind('UnitOfWork').toService('KyselyTransactionManager');
};
