import type { IAllEvents } from '@core';
import type { IEventListener } from './i-event-listener.ts';
import type { IEventEmitter } from './i-event-emitter.ts';

export type IEventBus<TEvents = IAllEvents> = IEventListener<TEvents> &
  IEventEmitter<TEvents> & {
    child: (namespace: string) => IEventBus<TEvents>;
  };
