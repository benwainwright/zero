import { TypedContainerModule } from '@inversifyjs/strongly-typed';
import { type IClientInternalTypes } from './i-client-internal-types.ts';
import { WebsocketCommandClient } from './websocket-command-client.ts';

export const websocketClientModule =
  new TypedContainerModule<IClientInternalTypes>((load) => {
    load.bind('CommandClient').to(WebsocketCommandClient);
  });
