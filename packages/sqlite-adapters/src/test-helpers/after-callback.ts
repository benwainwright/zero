import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { dropAllMigrations } from '../migrate/index.ts';
import type { IKyselySharedTypes } from '@zero/kysely-shared';
import type { DB } from '../core/database.ts';

export const afterCallback = async (
  container: TypedContainer<IKyselySharedTypes<DB>>
) => {
  const sqlite = await container.getAsync('KyselyDataSource');
  await dropAllMigrations(sqlite);
};
