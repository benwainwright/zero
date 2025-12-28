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

export interface IClientInternalTypes {
  UUIDGenerator: IUUIDGenerator;
  EventListener: IEventListener<IAllEvents & IQueryResponseEvent>;
  CommandClient: ICommandClient<IKnownCommands>;
  QueryClient: IQueryClient<IKnownQueries>;
}
