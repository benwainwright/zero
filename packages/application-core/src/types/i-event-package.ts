import type { IAllEvents } from '@core';

export type IEventPacket<
  TEvents,
  TKey extends keyof TEvents = keyof TEvents
> = TKey extends keyof IAllEvents
  ? {
      key: TKey;
      data: IAllEvents[TKey];
    }
  : never;
