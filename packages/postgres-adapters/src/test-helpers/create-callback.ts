import type { IInternalTypes } from '@core';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';

export const createCallback = async (
  container: TypedContainer<IInternalTypes & IApplicationTypes>
) => {
  const db = await container.getAsync('PostgresDatabase');
  const pool = await container.getAsync('PostgresConnectionPool');
  await pool.initialise();
  await container.unbind('PostgresDatabase');
  await container.unbind('UnitOfWork');
  container.bind('PostgresDatabase').toConstantValue(db);
  container.bind('UnitOfWork').toConstantValue(db);
};
