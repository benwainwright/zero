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
  await runMigrations({
    host: 'localhost',
    port: 5433,
    database: 'zero',
    password: 'password',
    user: 'postgres',
  });

  const db = await container.getAsync('KyselyTransactionManager');
  const pool = await container.getAsync('PostgresConnectionPool');
  await pool.initialise();
  await container.unbind('KyselyTransactionManager');
  await container.unbind('UnitOfWork');
  container.bind('KyselyTransactionManager').toConstantValue(db);
  container.bind('UnitOfWork').toService('KyselyTransactionManager');
};
