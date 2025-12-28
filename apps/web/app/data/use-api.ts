import { TypedContainer } from '@inversifyjs/strongly-typed';
import { type IApiSurface, type IAllEvents } from '@zero/application-core';
import {
  type IClientTypes,
  type IKnownCommands,
  type IKnownQueries,
  websocketClientModule,
} from '@zero/websocket-adapter/client';

import { useEffect, useState } from 'react';
import { useOpenSocket } from './use-open-socket.ts';

export const useApi = (url: string) => {
  const { socket } = useOpenSocket(url);

  const [api, setApi] =
    useState<IApiSurface<IKnownCommands, IKnownQueries, IAllEvents>>();

  useEffect(() => {
    (async () => {
      if (socket) {
        const container = new TypedContainer<IClientTypes>();
        await container.load(websocketClientModule);
        container.bind('Websocket').toConstantValue(socket);
        setApi(await container.getAsync('ApiSurface'));
      }
    })();
  }, [socket]);

  return api;
};
