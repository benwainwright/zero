import type {
  IKnownCommands,
  IKnownQueries,
  IQueryResponseEvent,
} from '@types';
import type { IAllEvents, IApiSurface } from '@zero/application-core';
import type { AuthEvents } from '@zero/auth';

export interface IClientTypes {
  ApiSurface: IApiSurface<
    IKnownCommands,
    IKnownQueries,
    IAllEvents & IQueryResponseEvent & AuthEvents
  >;
  Websocket: WebSocket;
}
