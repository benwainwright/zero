import {
  type IEventBus,
  type IAllEvents,
  type IApplicationTypes,
  type ErrorHandler,
} from '@zero/application-core';
import { type ILogger } from '@zero/bootstrap';
import { Serialiser } from '@zero/serialiser';
import { injectable } from 'inversify';
import { WebSocket } from 'ws';
import { inject } from './typed-inject.ts';
import type { IRequestResponseEvent, IWebsocketPacket } from '@types';
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
    private eventBus: IEventBus<IAllEvents & IRequestResponseEvent>,

    @inject('ErrorHandler')
    private errorHandler: ErrorHandler,

    @inject('Logger')
    private logger: ILogger
  ) {}

  public onConnect(socket: WebSocket) {
    this.errorHandler.withErrorHandling(() => {
      this.logger.debug(`Socket connected`, LOG_CONTEXT);
      this.eventBus.onAll((packet) => {
        this.logger.debug(`Event recieved`, { ...LOG_CONTEXT, packet });
        const serialiser = new Serialiser();
        const toSend = serialiser.serialise(packet);
        socket.send(toSend);
      });
    });
  }

  public onClose() {
    this.errorHandler.withErrorHandling(() => {
      this.eventBus.removeAll();
    });
  }

  public async onMessage(message: WebSocket.RawData) {
    await this.errorHandler.withErrorHandling(async () => {
      this.logger.silly(`Message received on socket`, LOG_CONTEXT);
      const serialiser = new Serialiser();
      const parsed = serialiser.deserialise(
        message.toString('utf-8')
      ) as IWebsocketPacket;

      this.logger.debug(`Message parsed`, {
        ...LOG_CONTEXT,
        message: JSON.stringify(parsed),
      });

      const queryBus = await this.container.getAsync('ServiceBus');

      switch (parsed.type) {
        case 'request':
          {
            try {
              const response = await queryBus.execute(parsed.packet);
              this.eventBus.emit('RequestResponseEvent', {
                id: parsed.packet.id,
                data: response,
                key: parsed.packet.key,
              });
            } catch (error) {
              this.eventBus.emit('RequestFailedEvent', {
                id: parsed.packet.id,
                key: parsed.packet.key,
              });
              throw error;
            }
          }
          break;
      }
    });
  }
}
