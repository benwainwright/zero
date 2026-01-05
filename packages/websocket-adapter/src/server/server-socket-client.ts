import {
  type IEventBus,
  type IAllEvents,
  type IApplicationTypes,
} from '@zero/application-core';
import { AbstractError, type ILogger } from '@zero/bootstrap';
import { Serialiser } from '@zero/serialiser';
import { injectable } from 'inversify';
import { WebSocket } from 'ws';
import { inject } from './typed-inject.ts';
import type { IQueryResponseEvent, IWebsocketPacket } from '@types';
import type { TypedContainer } from '@inversifyjs/strongly-typed';

export const LOG_CONTEXT = {
  context: 'websocket-server-socket-client',
};

@injectable()
export class ServerSocketClient {
  public constructor(
    @inject('Container')
    private readonly container: TypedContainer<IApplicationTypes>,

    @inject('EventBus')
    private eventBus: IEventBus<IAllEvents & IQueryResponseEvent>,

    @inject('Logger')
    private logger: ILogger
  ) {}

  public onConnect(socket: WebSocket) {
    this.logger.debug(`Socket connected`, LOG_CONTEXT);
    this.eventBus.onAll((packet) => {
      this.logger.debug(`Event recieved`, { ...LOG_CONTEXT, packet });
      const serialiser = new Serialiser();
      const toSend = serialiser.serialise(packet);
      socket.send(toSend);
    });
  }

  public onClose() {
    this.eventBus.removeAll();
  }

  public async onMessage(message: WebSocket.RawData) {
    this.logger.silly(`Message received on socket`, LOG_CONTEXT);
    try {
      const serialiser = new Serialiser();
      const parsed = serialiser.deserialise(
        message.toString('utf-8')
      ) as IWebsocketPacket;

      this.logger.debug(`Message parsed`, {
        ...LOG_CONTEXT,
        message: JSON.stringify(parsed),
      });

      const commandBus = await this.container.getAsync('CommandBus');
      const queryBus = await this.container.getAsync('QueryBus');

      if (parsed.type === 'command') {
        await commandBus.execute(parsed.packet);
      } else {
        const response = await queryBus.execute(parsed.packet);
        this.eventBus.emit('QueryResponseEvent', {
          id: parsed.packet.id,
          data: response,
        });
      }
    } catch (error) {
      if (error instanceof AbstractError) {
        this.logger.error(`${error.message}, ${String(error.stack)}`, {
          ...LOG_CONTEXT,
          error,
        });
        error.handle(this.eventBus);
        return;
      } else if (error instanceof Error) {
        this.logger.error(`${error.message}, ${String(error.stack)}`, {
          ...LOG_CONTEXT,
          error,
        });
      } else {
        this.logger.error(String(error), { ...LOG_CONTEXT, error });
      }
    }
  }
}
