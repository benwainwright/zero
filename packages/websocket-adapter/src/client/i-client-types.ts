import type { IKnownEvents } from '@client';
import type { IKnownRequests } from '@types';
import type { IEventListener, IServiceClient } from '@zero/application-core';

export interface IClientTypes {
  ServiceClient: IServiceClient<IKnownRequests>;
  Websocket: WebSocket;
  EventListener: IEventListener<IKnownEvents>;
}
