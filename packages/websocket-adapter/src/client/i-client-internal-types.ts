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
  Websocket: WebSocket;
  CommandClient: ICommandClient<IKnownCommands>;
  QueryClient: IQueryClient<IKnownQueries>;
  UUIDGenerator: IUUIDGenerator;
  EventListener: IEventListener<IAllEvents & IQueryResponseEvent>;
}
