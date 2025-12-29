import type {
  IKnownCommands,
  IKnownQueries,
  IQueryResponseEvent,
  IUUIDGenerator,
} from '@types';

import type {
  IAllEvents,
  ICommandClient,
  IEventListener,
  IQueryClient,
} from '@zero/application-core';

import type { AuthEvents } from '@zero/auth';

export interface IClientInternalTypes {
  UUIDGenerator: IUUIDGenerator;
  EventListener: IEventListener<IAllEvents & IQueryResponseEvent & AuthEvents>;
  CommandClient: ICommandClient<IKnownCommands>;
  QueryClient: IQueryClient<IKnownQueries>;
}
