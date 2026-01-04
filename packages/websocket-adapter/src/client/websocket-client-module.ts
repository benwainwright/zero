import { type IClientInternalTypes } from './i-client-internal-types.ts';

import { WebsocketCommandClient } from './websocket-command-client.ts';

import { WebsocketQueryClient } from './websocket-query-client.ts';

import { WebsocketEventListener } from './websocket-event-listener.ts';
import { v7 } from 'uuid';
import type { IClientTypes } from './i-client-types.ts';
import { WebsocketApi } from './websocket-api.ts';
import type { IModule } from '@zero/bootstrap';

export const websocketClientModule: IModule<
  IClientInternalTypes & IClientTypes
> = async ({ bind }) => {
  bind('CommandClient').to(WebsocketCommandClient);
  bind('QueryClient').to(WebsocketQueryClient);
  bind('EventListener').to(WebsocketEventListener);
  bind('ApiSurface').to(WebsocketApi);

  const uuidGenerator = {
    v7,
  };

  bind('UUIDGenerator').toConstantValue(uuidGenerator);
};
