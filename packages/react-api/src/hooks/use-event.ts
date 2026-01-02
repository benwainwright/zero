import type { IAllEvents, IEventPacket } from '@zero/application-core';
import type { AuthEvents } from '@zero/auth';

import { useEvents } from './use-events.ts';

export const useEvent = <TKey extends keyof (IAllEvents & AuthEvents)>(
  key: TKey,
  callback: (
    data: IEventPacket<IAllEvents & AuthEvents, TKey>['data']
  ) => Promise<void> | void
) => {
  useEvents((event) => {
    if (event.key === key) {
      void callback(event.data);
    }
  });
};
