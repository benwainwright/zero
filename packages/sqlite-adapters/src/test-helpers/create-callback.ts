import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { runMigrations } from '../migrate/index.ts';
import type { DB } from '@core';
import { type IKyselySharedTypes } from '@zero/kysely-shared';
import type { IApplicationTypes } from '@zero/application-core';

export const createCallback = async (
  container: TypedContainer<IKyselySharedTypes<DB> & IApplicationTypes>
) => {
  const sqlite = await container.getAsync('KyselyDataSource');

  await runMigrations(sqlite);
};
