import type {
  IAllEvents,
  IEventListener,
  IEventPacket,
  IListener,
} from '@zero/application-core';

import { Serialiser } from '@zero/serialiser';
import type { IQueryResponseEvent } from '@types';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';

@injectable()
export class WebsocketEventListener
  implements IEventListener<IAllEvents & IQueryResponseEvent>
{
  private listenerMap = new Map<string, (packet: MessageEvent) => void>();

  private nextListenerId = 0;

  public constructor(
    @inject('Websocket')
    private socket: WebSocket
  ) {}

  public off(identifier: string): void {
    const listenerToremove = this.listenerMap.get(identifier);
    if (listenerToremove) {
      this.socket.removeEventListener('message', listenerToremove);
    }
    this.listenerMap.delete(identifier);
  }

  public onAll(callback: IListener<IAllEvents & IQueryResponseEvent>): string {
    const listenerId = `listener-${this.nextListenerId++}`;

    const listener = (
      packet: MessageEvent<IAllEvents & IQueryResponseEvent>
    ) => {
      if (packet.type === 'message' && typeof packet.data === 'string') {
        const serialiser = new Serialiser();

        const parsed = serialiser.deserialise(packet.data) as IEventPacket<
          IAllEvents & IQueryResponseEvent
        >;
        callback(parsed);
      }
    };

    this.listenerMap.set(listenerId, listener);
    this.socket.addEventListener('message', listener);
    return listenerId;
  }

  public on<TKey extends keyof (IAllEvents & IQueryResponseEvent)>(
    key: TKey,
    callback: (
      data: IEventPacket<IAllEvents & IQueryResponseEvent, TKey>['data']
    ) => void
  ): string {
    const handler = (
      packet: IEventPacket<IAllEvents & IQueryResponseEvent>
    ) => {
      if (packet.key === key) {
        callback(packet.data);
      }
    };

    return this.onAll(handler);
  }

  public removeAll(): void {
    for (const [key] of this.listenerMap) {
      this.off(key);
    }
  }

  [Symbol.dispose](): void {
    this.removeAll();
  }
}
