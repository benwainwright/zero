import { PostgressDatabase, type IInternalTypes } from '@core';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { dropAllMigrations } from '@migrate';
import type { IApplicationTypes } from '@zero/application-core';

export const afterCallback = async (
  container: TypedContainer<IInternalTypes & IApplicationTypes>
) => {
  await dropAllMigrations({
    host: 'localhost',
    port: 5433,
    database: 'zero',
    password: 'password',
    user: 'postgres',
  });
  await container.unbind('PostgresDatabase');
  container.bind('PostgresDatabase').to(PostgressDatabase).inRequestScope();
  container.bind('UnitOfWork').toService('PostgresDatabase');
};
