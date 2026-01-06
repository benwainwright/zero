import type { IInternalTypes } from '@core';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { runMigrations } from '@migrate';
import type { IApplicationTypes } from '@zero/application-core';

export const createCallback = async (
  container: TypedContainer<IInternalTypes & IApplicationTypes>
) => {
  await runMigrations({
    host: 'localhost',
    port: 5433,
    database: 'zero',
    password: 'password',
    user: 'postgres',
  });
  const db = await container.getAsync('PostgresDatabase');
  const pool = await container.getAsync('PostgresConnectionPool');
  await pool.initialise();
  await container.unbind('PostgresDatabase');
  await container.unbind('UnitOfWork');
  container.bind('PostgresDatabase').toConstantValue(db);
  container.bind('UnitOfWork').toConstantValue(db);
};
