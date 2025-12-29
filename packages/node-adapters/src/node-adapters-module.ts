import { type IAuthTypes } from '@zero/auth';
import * as z from 'zod';
import { module } from '@zero/bootstrap';
import { NodePasswordHasher } from '@adapters';
import type { IInternalTypes } from './core/i-internal-types.ts';
import EventEmitter from 'node:events';
import { NodeEventBus } from './adapters/node-event-bus.ts';
import type { IApplicationTypes } from '@zero/application-core';
import { NodeStringHasher } from './adapters/node-string-hasher.ts';
import { FlatFileObjectStore } from './adapters/flat-file-object-store.ts';

export const nodeAdaptersModule = module<
  IAuthTypes & IInternalTypes & IApplicationTypes
>(({ load, bootstrapper }) => {
  load.bind('PasswordHasher').to(NodePasswordHasher);
  load.bind('EventBusListener').toConstantValue(new EventEmitter());
  load.bind('BusNamespace').toConstantValue(`ynab-plus`);
  load.bind('EventBus').to(NodeEventBus);
  load.bind('StringHasher').to(NodeStringHasher);
  load.bind('PasswordVerifier').to(NodePasswordHasher);
  load.bind('ObjectStore').to(FlatFileObjectStore);

  const storagePath = bootstrapper.configValue({
    namespace: 'storage',
    key: 'location',
    schema: z.string(),
    description:
      'Path to file storage. Used for things like session data and request cache',
  });

  load.bind('StoragePath').toConstantValue(storagePath);
});
