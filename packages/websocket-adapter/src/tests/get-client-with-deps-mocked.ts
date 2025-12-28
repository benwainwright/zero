import { type IClientInternalTypes, websocketClientModule } from '@client';
import {
  TypedContainer,
  TypedContainerModule,
} from '@inversifyjs/strongly-typed';
import { type IUUIDGenerator } from '@types';
import { type ILogger, type IBootstrapTypes } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';

export const getClientWithDepsMocked = async (port: number) => {
  const container = new TypedContainer<
    IClientInternalTypes & IBootstrapTypes
  >();

  const uuidGenerator = mock<IUUIDGenerator>();
  const logger = mock<ILogger>();

  await container.load(websocketClientModule);
  container.bind('UUIDGenerator').toConstantValue(uuidGenerator);
  container.bind('Logger').toConstantValue(logger);

  const socket = await new Promise<WebSocket>((accept) => {
    const socket = new WebSocket(`ws://localhost:${String(port)}`);
    socket.addEventListener('open', () => {
      accept(socket);
    });
  });

  const overrideModule = new TypedContainerModule<IClientInternalTypes>(
    (load) => {
      load.bind('Websocket').toConstantValue(socket);
    }
  );

  await container.load(overrideModule);

  const commandClient = container.get('CommandClient');
  const queryClient = container.get('QueryClient');

  return { commandClient, logger, uuidGenerator, socket, queryClient };
};
