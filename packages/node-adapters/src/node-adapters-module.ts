import { type IAuthTypes } from '@zero/auth';
import * as z from 'zod';
import { type IModule } from '@zero/bootstrap';
import { NodePasswordHasher } from '@adapters';
import type { IInternalTypes } from './core/i-internal-types.ts';
import EventEmitter from 'node:events';
import { NodeEventBus } from './adapters/node-event-bus.ts';
import type { IApplicationTypes } from '@zero/application-core';
import { NodeStringHasher } from './adapters/node-string-hasher.ts';
import { FlatFileObjectStore } from './adapters/flat-file-object-store.ts';

export const nodeAdaptersModule: IModule<
  IAuthTypes & IInternalTypes & IApplicationTypes
> = async ({ logger, bind, configValue }) => {
  logger.info(`Initialising node adapters module`);

  bind('PasswordHasher').to(NodePasswordHasher);
  bind('EventBusListener').toConstantValue(new EventEmitter());
  bind('BusNamespace').toConstantValue(`ynab-plus`);
  bind('EventBus').to(NodeEventBus);
  bind('StringHasher').to(NodeStringHasher);
  bind('PasswordVerifier').to(NodePasswordHasher);
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
