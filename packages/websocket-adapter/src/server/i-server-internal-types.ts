import { AppServer } from './app-server.ts';
import { ServerSocketClient } from './server-socket-client.ts';
import type { ConfigValue } from '@zero/bootstrap';

export interface IServerInternalTypes {
  AppServer: AppServer;
  ServerWebsocketClient: ServerSocketClient;
  WebsocketServerHost: ConfigValue<string>;
  WebsocketServerPort: ConfigValue<number>;
}
