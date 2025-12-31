import type { IKnownCommands, IUUIDGenerator } from '@types';
import type { ICommandClient, ICommandParams } from '@zero/application-core';
import { Serialiser } from '@zero/serialiser';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';

@injectable()
export class WebsocketCommandClient implements ICommandClient<IKnownCommands> {
  public constructor(
    @inject('Websocket')
    private socket: WebSocket,

    @inject('UUIDGenerator')
    private uuidGenerator: IUUIDGenerator
  ) {}

  public async execute<
    TCommand extends IKnownCommands,
    TKey extends TCommand['key']
  >(key: TKey, ...params: ICommandParams<TCommand>): Promise<void> {
    const packet = {
      type: 'command',
      packet: {
        id: this.uuidGenerator.v7(),
        key,
        params: params[0],
      },
    };

    const serialiser = new Serialiser();

    this.socket.send(serialiser.serialise(packet));
  }
}
