import type { IAllEvents } from '@core';
import type { IEventPacket } from '@types';

export type IListener<TEvents = IAllEvents> = (
  arg: IEventPacket<TEvents, keyof TEvents>
) => void;

export interface IEventListener<TEvents> {
  off(identifier: string): void;

  onAll(callback: IListener<TEvents>): string;

  on<TKey extends keyof TEvents>(
    key: TKey,
    callback: (
      data: IEventPacket<TEvents, TKey>['data']
    ) => void | Promise<void>
  ): string;

  [Symbol.dispose](): void;

  removeAll(): void;
}
