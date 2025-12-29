import type { IListener } from '@zero/application-core';
import { useContext, useEffect, useRef } from 'react';
import { ApiContext } from './api-provider.tsx';

export const useEvents =
  typeof window !== 'undefined'
    ? (callback: IListener) => {
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
