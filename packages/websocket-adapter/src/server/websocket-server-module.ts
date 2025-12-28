import { AppServer } from './app-server.ts';
import { ServerSocketClient } from './server-socket-client.ts';
import { v7 } from 'uuid';
import * as z from 'zod';

import { module } from '@zero/bootstrap';
import { type IServerInternalTypes } from './i-server-internal-types.ts';
import { SessionIdHandler } from './session-id-handler.ts';
export const websocketServerModule = module<IServerInternalTypes>(
  ({ load, container, bootstrapper, logger }) => {
    load.bind('ServerWebsocketClient').to(ServerSocketClient);
    load.bind('AppServer').to(AppServer);

    bootstrapper.addInitStep(async () => {
      const server = await container.getAsync('AppServer');
      logger.info(`Starting websocket server`);
      await server.start();
    });

    load.bind('SessionIdHandler').to(SessionIdHandler);
    load.bind('SessionIdCookieKey').toConstantValue('zero-session-id');

    const uuidGenerator = {
      v7,
    };

    load.bind('UUIDGenerator').toConstantValue(uuidGenerator);

    load.bind('WebsocketServerHost').toConstantValue(
      bootstrapper.configValue({
        namespace: `websocketServer`,
        key: 'host',
        schema: z.string(),
        description: `Websocket server will listen from this host`,
      })
    );

    load.bind('WebsocketServerPort').toConstantValue(
      bootstrapper.configValue({
        namespace: 'websocketServer',
        key: 'port',
        schema: z.number(),
        description: 'Websocket server will listen from this port',
      })
    );
  }
);
