import {
  testUserAndRoleRepository,
  createRepo,
} from '@zero/data-adapters-tests';

import {
  postgresAdaptersModule,
  PostgressDatabase,
  testOverridesModule,
} from '@core';
import type { IInternalTypes } from '@types';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';

const createCallback = async (
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

const afterCallback = async (
  container: TypedContainer<IInternalTypes & IApplicationTypes>
) => {
  const pool = await container.getAsync('PostgresConnectionPool');
  await pool.dropTables();

  await container.unbind('PostgresDatabase');
  container.bind('PostgresDatabase').to(PostgressDatabase).inRequestScope();
  container.bind('UnitOfWork').toService('PostgresDatabase');
};

const creator = await createRepo({
  repoKey: { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
  modules: [postgresAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});

testUserAndRoleRepository(creator);
