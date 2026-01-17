import type { IAllEvents, IEventBus } from '@zero/application-core';
import { AppServer } from './app-server.ts';
import { ServerSocketClient } from './server-socket-client.ts';
import type { ConfigValue } from '@zero/bootstrap';
import type { IRequestResponseEvent, IUUIDGenerator } from '@types';
import type { SessionIdHandler } from './session-id-handler.ts';

export interface IServerInternalTypes {
  AppServer: AppServer;
  CookieDomain: ConfigValue<string>;
  ServerWebsocketClient: ServerSocketClient;
  SessionIdCookieKey: string;
  SessionIdHandler: SessionIdHandler;
  WebsocketServerHost: ConfigValue<string>;
  UUIDGenerator: IUUIDGenerator;
  WebsocketServerPort: ConfigValue<number>;
  EventBus: IEventBus<IAllEvents & IRequestResponseEvent>;
}
