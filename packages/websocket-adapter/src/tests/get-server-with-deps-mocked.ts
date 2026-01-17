import {
  TypedContainer,
  TypedContainerModule,
} from '@inversifyjs/strongly-typed';
import {
  AppServer,
  type IServerInternalTypes,
  websocketServerModule,
} from '@server';
import { mock } from 'vitest-mock-extended';

import {
  type IApplicationTypes,
  type IEventBus,
  type IServiceBus,
  ErrorHandler,
} from '@zero/application-core';

import {
  ConfigValue,
  type IBootstrapper,
  type ILogger,
  type IBootstrapTypes,
  type IDecoratorManager,
  testModule,
} from '@zero/bootstrap';

import getPort from 'get-port';
import type { Mocked } from 'vitest';
import type { Factory } from 'inversify';

interface IServerWithDeps {
  server: AppServer;
  serviceBus: Mocked<IServiceBus>;
  port: number;
  logger: Mocked<ILogger>;
  eventBus: Mocked<IEventBus>;
  containerFactory: Mocked<Factory<TypedContainer>>;
}

export const getServerWithDepsMocked = async (): Promise<IServerWithDeps> => {
  const container = new TypedContainer<
    IServerInternalTypes & IApplicationTypes & IBootstrapTypes
  >();
  await container.load(testModule(websocketServerModule));

  const freePort = await getPort();

  const overridesModule = new TypedContainerModule<IServerInternalTypes>(
    (load) => {
      load
        .rebindSync('WebsocketServerHost')
        .toConstantValue(new ConfigValue(Promise.resolve('localhost')));

      load
        .rebindSync('WebsocketServerPort')
        .toConstantValue(new ConfigValue(Promise.resolve(freePort)));
    }
  );

  const eventBus = mock<IEventBus>();

  eventBus.onAll.mockImplementation((callback) => {
    eventBus.emit.mockImplementation((key, data) => {
      callback({ key, data } as Parameters<typeof callback>[0]);
    });
    return '0';
  });

  container.bind('ErrorHandler').to(ErrorHandler);

  container.bind('EventBus').toConstantValue(eventBus);

  const bootstrapper = mock<IBootstrapper>();
  container.bind('Bootstrapper').toConstantValue(bootstrapper);
  container.bind('Container').toConstantValue(container);

  const containerFactory = vi.fn();
  container.bind('ContainerFactory').toConstantValue(containerFactory);

  containerFactory.mockResolvedValue(container);

  const logger = mock<ILogger>();
  container.bind('Logger').toConstantValue(logger);

  const serviceBus = mock<IServiceBus>();

  const decoratorManager = mock<IDecoratorManager>();

  container.bind('ServiceBus').toConstantValue(serviceBus);
  container.bind('DecoratorManager').toConstantValue(decoratorManager);

  await container.getAsync('Bootstrapper');
  await container.load(overridesModule);
  const server = await container.getAsync('AppServer');

  return {
    server,
    serviceBus,
    port: freePort,
    logger,
    eventBus,
    containerFactory,
  };
};
