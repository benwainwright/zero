import { type IClientInternalTypes } from './i-client-internal-types.ts';

import { WebsocketServiceClient } from './websocker-service-client.ts';

import { WebsocketEventListener } from './websocket-event-listener.ts';
import { v7 } from 'uuid';
import type { IClientTypes } from './i-client-types.ts';
import { TypedContainerModule } from '@inversifyjs/strongly-typed';

export const websocketClientModule = new TypedContainerModule<
  IClientInternalTypes & IClientTypes
>((load) => {
  load.bind('EventListener').to(WebsocketEventListener);
  load.bind('ServiceClient').to(WebsocketServiceClient);

  const uuidGenerator = {
    v7,
  };

  load.bind('UUIDGenerator').toConstantValue(uuidGenerator);
});
