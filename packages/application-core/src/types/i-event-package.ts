export type IEventPacket<
  TEvents,
  TKey extends keyof TEvents = keyof TEvents
> = TKey extends keyof TEvents
  ? {
      key: TKey;
      data: TEvents[TKey];
    }
  : never;
