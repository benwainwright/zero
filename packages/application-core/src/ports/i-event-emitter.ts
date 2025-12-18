import type { IAllEvents } from '@core';

export interface IEventEmitter<TEvents = IAllEvents> {
  emit<TKey extends keyof TEvents>(key: TKey, data: TEvents[TKey]): void;

  [Symbol.dispose](): void;

  removeAll(): void;
}
