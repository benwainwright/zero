import { AppServer } from './app-server.ts';
import { ServerSocketClient } from './server-socket-client.ts';
import { v7 } from 'uuid';
import * as z from 'zod';

import { type IModule } from '@zero/bootstrap';
import { type IServerInternalTypes } from './i-server-internal-types.ts';
import { SessionIdHandler } from './session-id-handler.ts';

export const websocketServerModule: IModule<IServerInternalTypes> = async ({
  logger,
  bind,
  configValue,
  onInit,
  getAsync,
}) => {
  logger.info(`Initialising websocket server module`);
  bind('ServerWebsocketClient').to(ServerSocketClient);
  bind('AppServer').to(AppServer);

  onInit(async () => {
    const server = await getAsync('AppServer');
    logger.info(`Starting websocket server`);
    await server.start();
  });

  bind('SessionIdHandler').to(SessionIdHandler);
  bind('SessionIdCookieKey').toConstantValue('zero-session-id');

  const uuidGenerator = {
    v7,
  };

  bind('UUIDGenerator').toConstantValue(uuidGenerator);

  bind('WebsocketServerHost').toConstantValue(
    configValue({
      namespace: `websocketServer`,
      key: 'host',
      schema: z.string(),
      description: `Websocket server will listen from this host`,
    })
  );

  bind('WebsocketServerPort').toConstantValue(
    configValue({
      namespace: 'websocketServer',
      key: 'port',
      schema: z.number(),
      description: 'Websocket server will listen from this port',
    })
  );
};
