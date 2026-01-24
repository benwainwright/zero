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
  const pool = await container.getAsync('PostgresConnectionPool');
  await dropAllMigrations(pool);
  await pool.close();
  await container.unbind('KyselyTransactionManager');
  await container.unbind('UnitOfWork');
  container
    .bind('KyselyTransactionManager')
    .to(KyselyUnitOfWork)
    .inRequestScope();
  container.bind('UnitOfWork').toService('KyselyTransactionManager');
};
