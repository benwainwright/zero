import type { IKnownQueries, IUUIDGenerator } from '@types';
import type {
  IEventListener,
  IPickQuery,
  IQueryClient,
  IQueryParams,
} from '@zero/application-core';
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

  public async execute<
    TQuery extends IKnownQueries,
    TKey extends TQuery['key']
  >(
    key: TKey,
    ...params: IQueryParams<TQuery>
  ): Promise<IPickQuery<TQuery, TKey>['response']> {
    const id = this.uuidGenerator.v7();

    const packet = {
      type: 'query',
      packet: {
        id,
        key,
        params: params[0],
      },
    };

    const serialiser = new Serialiser();

    this.socket.send(serialiser.serialise(packet));

    return await new Promise((accept) => {
      const listener = this.eventBus.on('QueryResponseEvent', (data) => {
        if (data.id === id) {
          const newData = data.data as Promise<
            IPickQuery<TQuery, TKey>['response']
          >;

          if (newData) {
            accept(newData);
          }
          this.eventBus.off(listener);
        }
      });
    });
  }
}
