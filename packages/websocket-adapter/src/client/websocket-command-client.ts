import type { IKnownCommands, IUUIDGenerator } from '@types';
import type { ICommandClient } from '@zero/application-core';
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

  public async execute(command: Omit<IKnownCommands, 'id'>): Promise<void> {
    const packet = {
      type: 'command',
      packet: {
        id: this.uuidGenerator.v7(),
        ...command,
      },
    };

    const serialiser = new Serialiser();

    this.socket.send(serialiser.serialise(packet));
  }
}
