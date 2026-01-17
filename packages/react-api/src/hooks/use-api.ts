import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IEventListener, IServiceClient } from '@zero/application-core';

import {
  type IClientTypes,
  type IKnownEvents,
  type IKnownRequests,
  websocketClientModule,
} from '@zero/websocket-adapter/client';

import { useEffect, useState } from 'react';
import { useOpenSocket } from './use-open-socket.ts';

interface IApi {
  services: IServiceClient<IKnownRequests>;
  eventBus: IEventListener<IKnownEvents>;
}

export const useApi = (url: string) => {
  const { socket } = useOpenSocket(url);

  const [api, setApi] = useState<IApi>();

  useEffect(() => {
    (async () => {
      if (socket) {
        const container = new TypedContainer<IClientTypes>();
        await container.load(websocketClientModule);
        container.bind('Websocket').toConstantValue(socket);
        const services = await container.getAsync('ServiceClient');
        const eventBus = await container.getAsync('EventListener');
        setApi({
          services,
          eventBus,
        });
      }
    })();
  }, [socket]);

  return api;
};
