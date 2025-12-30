import type {
  IEventListener,
  IEventPacket,
  IListener,
} from '@zero/application-core';

import { Serialiser } from '@zero/serialiser';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';
import type { IKnownEvents } from './i-known-events.ts';

@injectable()
export class WebsocketEventListener implements IEventListener<IKnownEvents> {
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

  public onAll(callback: IListener<IKnownEvents>): string {
    const listenerId = `listener-${this.nextListenerId++}`;

    const listener = (packet: MessageEvent<IKnownEvents>) => {
      if (packet.type === 'message' && typeof packet.data === 'string') {
        const serialiser = new Serialiser();

        const parsed = serialiser.deserialise(
          packet.data
        ) as IEventPacket<IKnownEvents>;
        callback(parsed);
      }
    };

    this.listenerMap.set(listenerId, listener);
    this.socket.addEventListener('message', listener);
    return listenerId;
  }

  public on<TKey extends keyof IKnownEvents>(
    key: TKey,
    callback: (data: IEventPacket<IKnownEvents, TKey>['data']) => void
  ): string {
    const handler = (packet: IEventPacket<IKnownEvents>) => {
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
