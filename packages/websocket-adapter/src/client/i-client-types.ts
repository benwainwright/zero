import type {
  IKnownCommands,
  IKnownQueries,
  IQueryResponseEvent,
} from '@types';
import type { IAllEvents, IApiSurface } from '@zero/application-core';

export interface IClientTypes {
  ApiSurface: IApiSurface<
    IKnownCommands,
    IKnownQueries,
    IAllEvents & IQueryResponseEvent
  >;
  Websocket: WebSocket;
}
