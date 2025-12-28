import { TypedContainerModule } from '@inversifyjs/strongly-typed';
import { type IClientInternalTypes } from './i-client-internal-types.ts';
import { WebsocketCommandClient } from './websocket-command-client.ts';
import { WebsocketQueryClient } from './websocket-query-client.ts';
import { WebsocketEventListener } from './websocket-event-listener.ts';
import { v7 } from 'uuid';

export const websocketClientModule =
  new TypedContainerModule<IClientInternalTypes>((load) => {
    load.bind('CommandClient').to(WebsocketCommandClient);
    load.bind('QueryClient').to(WebsocketQueryClient);
    load.bind('EventListener').to(WebsocketEventListener);

    const uuidGenerator = {
      v7,
    };

    load.bind('UUIDGenerator').toConstantValue(uuidGenerator);
  });
