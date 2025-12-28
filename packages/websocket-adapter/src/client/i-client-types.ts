import type { IKnownCommands, IKnownQueries } from '@types';
import type { IAllEvents, IApiSurface } from '@zero/application-core';

export interface IClientTypes {
  ApiSurface: IApiSurface<IKnownCommands, IKnownQueries, IAllEvents>;
  Websocket: WebSocket;
}
