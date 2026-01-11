import type { IKnownEvents } from '@client';
import type { IKnownCommands, IKnownQueries, IUUIDGenerator } from '@types';

import type {
  ICommandClient,
  IEventListener,
  IQueryClient,
} from '@zero/application-core';

export interface IClientInternalTypes {
  UUIDGenerator: IUUIDGenerator;
  EventListener: IEventListener<IKnownEvents>;
  CommandClient: ICommandClient<IKnownCommands>;
  QueryClient: IQueryClient<IKnownQueries>;
}
