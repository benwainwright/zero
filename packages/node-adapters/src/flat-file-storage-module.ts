import type { IModule } from '@zero/bootstrap';
import { FlatFileObjectStore } from './adapters/flat-file-object-store.ts';
import type { IApplicationTypes } from '@zero/application-core';
import type { IInternalTypes } from '@core';
import z from 'zod';

export const flatFileStorageModule: IModule<
  IInternalTypes & IApplicationTypes
> = async ({ bind, configValue }) => {
  bind('ObjectStore').to(FlatFileObjectStore);

  const storagePath = configValue({
    namespace: 'storage',
    key: 'location',
    schema: z.string(),
    description:
      'Path to file storage. Used for things like session data and request cache',
  });

  bind('StoragePath').toConstantValue(storagePath);
};
