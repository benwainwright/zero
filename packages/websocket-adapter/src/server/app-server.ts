import { type ISessionIdRequester } from '@zero/application-core';
import { ConfigValue, type ILogger } from '@zero/bootstrap';
import { WebSocketServer } from 'ws';

import { SessionIdHandler } from './session-id-handler.ts';
import { inject } from './typed-inject.ts';
import { type IServerInternalTypes } from './i-server-internal-types.ts';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { ServerSocketClient } from './server-socket-client.ts';

export const LOG_CONTEXT = {
  context: 'app-server',
};

export class AppServer {
  public close() {
    this.wss?.close();
    this.clientSet.values().forEach((client) => {
      client.onClose();
    });
  }

  [Symbol.asyncDispose]() {
    this.close();
  }

  private sessionIdHandler: SessionIdHandler;

  public readonly name = 'Websocket Server';

  private wss: WebSocketServer | undefined;

  public constructor(
    @inject('ContainerFactory')
    private requestContainerFactory: (
      sessionIdRequester: ISessionIdRequester
    ) => Promise<TypedContainer<IServerInternalTypes>>,

    @inject('WebsocketServerPort')
    private port: ConfigValue<number>,

    @inject('WebsocketServerHost')
    private host: ConfigValue<string>,

    @inject('Logger')
    private logger: ILogger
  ) {
    this.sessionIdHandler = new SessionIdHandler(logger);
  }

  private clientSet = new Set<ServerSocketClient>();

  public async start() {
    this.wss = new WebSocketServer({
      port: await this.port.value,
      host: await this.host.value,
    });

    return new Promise<void>((accept) => {
      this.wss?.on('error', (error) => {
        this.logger.error(`Websocket server error ${error}`, {
          ...LOG_CONTEXT,
          error,
        });
      });

      this.wss?.on('headers', (headers, request) => {
        this.sessionIdHandler.setSesionId(headers, request);
      });

      this.wss?.on('close', () => {
        this.logger.info(`Websocket closed`, { ...LOG_CONTEXT });
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.wss?.on('connection', async (ws, request) => {
        this.logger.debug('Websocket connection established', LOG_CONTEXT);

        const container = await this.requestContainerFactory({
          // eslint-disable-next-line @typescript-eslint/require-await
          getSessionId: async () => {
            return this.sessionIdHandler.getSessionId(request);
          },
        });

        const client = await container.getAsync('ServerWebsocketClient');
        this.clientSet.add(client);

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ws.on('message', client.onMessage.bind(client));
        ws.on('close', () => {
          client.onClose();
          this.clientSet.delete(client);
        });

        client.onConnect(ws);
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.wss?.on('listening', async () => {
        this.logger.info(
          `Websocket server listening on host ${await this.host.value}:${String(
            await this.port.value
          )}`,
          LOG_CONTEXT
        );
        accept();
      });
    });
  }
}
