import type { IInternalTypes } from '@core';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { runMigrations } from '@migrate';
import type { IApplicationTypes } from '@zero/application-core';
import type { IKyselySharedTypes } from '@zero/kysely-shared';
import type { DB } from '../core/database.ts';

export const createCallback = async (
  container: TypedContainer<
    IInternalTypes & IApplicationTypes & IKyselySharedTypes<DB>
  >
) => {
  const pool = await container.getAsync('PostgresConnectionPool');
  await pool.initialise();
  await runMigrations(pool);
  const db = await container.getAsync('KyselyTransactionManager');
  await container.unbind('KyselyTransactionManager');
  await container.unbind('UnitOfWork');
  container.bind('KyselyTransactionManager').toConstantValue(db);
  container.bind('UnitOfWork').toService('KyselyTransactionManager');
};
