import type { IKnownQueries, IUUIDGenerator } from '@types';
import type { IEventListener, IQueryClient } from '@zero/application-core';
import { inject } from './typed-inject.ts';
import { Serialiser } from '@zero/serialiser';
import type { IKnownEvents } from './i-known-events.ts';

export class WebsocketQueryClient implements IQueryClient<IKnownQueries> {
  public constructor(
    @inject('Websocket')
    private socket: WebSocket,

    @inject('UUIDGenerator')
    private uuidGenerator: IUUIDGenerator,

    @inject('EventListener')
    private eventBus: IEventListener<IKnownEvents>
  ) {}

  public async execute<TQuery extends IKnownQueries>(
    query: Omit<TQuery['query'], 'id'>
  ): Promise<TQuery['response']> {
    const id = this.uuidGenerator.v7();
    const packet = {
      type: 'query',
      packet: {
        id,
        ...query,
      },
    };

    const serialiser = new Serialiser();

    this.socket.send(serialiser.serialise(packet));

    return await new Promise((accept) => {
      const listener = this.eventBus.on('QueryResponseEvent', (data) => {
        if (data.id === id) {
          accept(data.data as TQuery['response']);
          this.eventBus.off(listener);
        }
      });
    });
  }
}
