import type { IKnownEvents } from '@client';
import type { IKnownCommands, IKnownQueries } from '@types';
import type { IApiSurface } from '@zero/application-core';

export interface IClientTypes {
  ApiSurface: IApiSurface<IKnownCommands, IKnownQueries, IKnownEvents>;
  Websocket: WebSocket;
}
