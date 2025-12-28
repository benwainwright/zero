import type { IAllEvents, IEventBus } from '@zero/application-core';
import { AppServer } from './app-server.ts';
import { ServerSocketClient } from './server-socket-client.ts';
import type { ConfigValue } from '@zero/bootstrap';
import type { IQueryResponseEvent } from '@types';

export interface IServerInternalTypes {
  AppServer: AppServer;
  ServerWebsocketClient: ServerSocketClient;
  WebsocketServerHost: ConfigValue<string>;
  WebsocketServerPort: ConfigValue<number>;
  EventBus: IEventBus<IAllEvents & IQueryResponseEvent>;
}
