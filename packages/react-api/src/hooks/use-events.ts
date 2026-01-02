import type { IListener } from '@zero/application-core';
import { useContext, useEffect, useRef } from 'react';
import { ApiContext } from '@providers';
import type { IKnownEvents } from '@zero/websocket-adapter/client';

export const useEvents =
  typeof window !== 'undefined'
    ? (callback: IListener<IKnownEvents>) => {
        const { api } = useContext(ApiContext);
        const listener = useRef<string | undefined>(undefined);

        useEffect(() => {
          if (api) {
            listener.current = api.onAll(callback);
          }
          return () => {
            if (listener.current) {
              api?.off(listener.current);
            }
          };
        }, [api]);
      }
    : () => {};
