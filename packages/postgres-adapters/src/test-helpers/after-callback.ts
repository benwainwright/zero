import { PostgressDatabase, type IInternalTypes } from '@core';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';

export const afterCallback = async (
  container: TypedContainer<IInternalTypes & IApplicationTypes>
) => {
  const pool = await container.getAsync('PostgresConnectionPool');
  await pool.dropTables();
  await pool.close();

  await container.unbind('PostgresDatabase');
  container.bind('PostgresDatabase').to(PostgressDatabase).inRequestScope();
  container.bind('UnitOfWork').toService('PostgresDatabase');
};
