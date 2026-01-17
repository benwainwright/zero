import type { IKnownRequests, IUUIDGenerator } from '@types';
import type {
  ExecuteParams,
  IEventListener,
  IPickRequest,
  IServiceClient,
} from '@zero/application-core';
import { inject } from './typed-inject.ts';
import { Serialiser } from '@zero/serialiser';
import type { IKnownEvents } from './i-known-events.ts';

export class WebsocketServiceClient implements IServiceClient<IKnownRequests> {
  public constructor(
    @inject('Websocket')
    private socket: WebSocket,

    @inject('UUIDGenerator')
    private uuidGenerator: IUUIDGenerator,

    @inject('EventListener')
    private eventBus: IEventListener<IKnownEvents>
  ) {}

  public async execute<
    TRequest extends IKnownRequests,
    TKey extends TRequest['key'],
    NotUndefined
  >(
    key: TKey,
    ...params: ExecuteParams<IKnownRequests, TRequest, TKey, NotUndefined>
  ): Promise<IPickRequest<TRequest, TKey>['response']> {
    const id = this.uuidGenerator.v7();

    const packet = {
      type: 'request',
      packet: {
        id,
        key,
        params: params[0],
      },
    };

    const serialiser = new Serialiser();

    this.socket.send(serialiser.serialise(packet));

    return await new Promise((accept) => {
      const listener = this.eventBus.on('RequestResponseEvent', (data) => {
        if (data.id === id) {
          const newData = data.data as Promise<
            IPickRequest<TRequest, TKey>['response']
          >;

          accept(newData);
          this.eventBus.off(listener);
        }
      });
    });
  }
}
