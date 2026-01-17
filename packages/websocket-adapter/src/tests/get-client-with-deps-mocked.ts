import {
  type IClientInternalTypes,
  type IClientTypes,
  websocketClientModule,
} from '@client';
import {
  TypedContainer,
  TypedContainerModule,
} from '@inversifyjs/strongly-typed';
import { type IUUIDGenerator } from '@types';
import { type ILogger, type IBootstrapTypes } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';

export const getClientWithDepsMocked = async (port: number) => {
  const container = new TypedContainer<
    IClientInternalTypes & IBootstrapTypes & IClientTypes
  >();

  const uuidGenerator = mock<IUUIDGenerator>();
  const logger = mock<ILogger>();

  await container.load(websocketClientModule);
  container.rebindSync('UUIDGenerator').toConstantValue(uuidGenerator);
  container.bind('Logger').toConstantValue(logger);

  const socket = await new Promise<WebSocket>((accept) => {
    const socket = new WebSocket(`ws://localhost:${String(port)}`);
    socket.addEventListener('open', () => {
      accept(socket);
    });
  });

  const overrideModule = new TypedContainerModule<
    IClientInternalTypes & IClientTypes
  >((load) => {
    load.bind('Websocket').toConstantValue(socket);
  });

  await container.load(overrideModule);

  const serviceClient = container.get('ServiceClient');

  return { serviceClient, logger, uuidGenerator, socket };
};
