import type { IEventPacket } from '@zero/application-core';

import { useEvents } from './use-events.ts';
import type { IKnownEvents } from '@zero/websocket-adapter/client';

export const useEvent = <TKey extends keyof IKnownEvents>(
  key: TKey,
  callback: (
    data: IEventPacket<IKnownEvents, TKey>['data']
  ) => Promise<void> | void
) => {
  useEvents((event) => {
    if (event.key === key) {
      void callback(event.data);
    }
  });
};
