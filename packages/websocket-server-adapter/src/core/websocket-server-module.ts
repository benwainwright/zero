import { AppServer, ServerSocketClient } from '@lib';
import * as z from 'zod';

import { module } from '@zero/bootstrap';
export const websocketServerModule = module(
  ({ load, container, bootstrapper, logger }) => {
    load.bind('ServerWebsocketClient').to(ServerSocketClient);
    load.bind('AppServer').to(AppServer);

    bootstrapper.addInitStep(async () => {
      const server = await container.getAsync('AppServer');
      logger.info(`Starting websocket server`);
      await server.start();
    });

    load.bind('WebsocketServerHost').toConstantValue(
      bootstrapper.configValue({
        namespace: `websocketServer`,
        key: 'host',
        schema: z.string(),
        description: `Host name for the websocket server to listen on`,
      })
    );

    load.bind('WebsocketServerPort').toConstantValue(
      bootstrapper.configValue({
        namespace: 'websocketServer',
        key: 'port',
        schema: z.number(),
        description: 'Port for the websocket server to listen on',
      })
    );
  }
);
