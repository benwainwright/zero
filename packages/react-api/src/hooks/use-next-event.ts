import { ApiContext } from '@providers';
import type { IEventPacket } from '@zero/application-core';
import type { IKnownEvents } from '@zero/websocket-adapter/client';
import { useCallback, useContext } from 'react';

export const useNextEvent = <TKey extends keyof IKnownEvents>(key: TKey) => {
  const { api } = useContext(ApiContext);

  return useCallback(
    async (
      filter?: (
        data: IEventPacket<IKnownEvents, TKey>['data']
      ) => Promise<boolean> | boolean
    ): Promise<IEventPacket<IKnownEvents, TKey>['data'] | undefined> => {
      if (api) {
        return new Promise((accept) => {
          const handle = api.eventBus.on(key, async (data) => {
            if (!filter || (await filter(data))) {
              api.eventBus.off(handle);
              accept(data);
            }
          });
        });
      }
      return undefined;
    },
    [api]
  );
};
