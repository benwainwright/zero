import type { AppServer, ServerSocketClient } from '@lib';
import type { ConfigValue } from '@zero/bootstrap';

export interface IInternalTypes {
  AppServer: AppServer;
  ServerWebsocketClient: ServerSocketClient;
  WebsocketServerHost: ConfigValue<string>;
  WebsocketServerPort: ConfigValue<number>;
}
