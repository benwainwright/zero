import type { IInternalTypes } from '@core';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';

export const afterCallback = async (
  container: TypedContainer<IInternalTypes & IApplicationTypes>
) => {
  const adapter = await container.getAsync('SqliteDatabase');

  await adapter.dropTables();
};
