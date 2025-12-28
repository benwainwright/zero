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
  type ICommandBus,
  type IApplicationTypes,
  type IQueryBus,
  type IEventBus,
} from '@zero/application-core';

import {
  ConfigValue,
  type IBootstrapper,
  type ILogger,
  type IBootstrapTypes,
  type IDecoratorManager,
} from '@zero/bootstrap';

import getPort from 'get-port';
import type { Mocked } from 'vitest';
import type { Factory } from 'inversify';
import { EventEmitter } from 'node:events';

interface IServerWithDeps {
  server: AppServer;
  commandBus: Mocked<ICommandBus>;
  queryBus: Mocked<IQueryBus>;
  port: number;
  logger: Mocked<ILogger>;
  eventBus: Mocked<IEventBus>;
  containerFactory: Mocked<Factory<TypedContainer>>;
}

export const getServerWithDepsMocked = async (): Promise<IServerWithDeps> => {
  const container = new TypedContainer<
    IServerInternalTypes & IApplicationTypes & IBootstrapTypes
  >();
  await container.load(websocketServerModule);

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

  container.bind('EventBus').toConstantValue(eventBus);

  const bootstrapper = mock<IBootstrapper>();
  container.bind('Bootstrapper').toConstantValue(bootstrapper);
  container.bind('Container').toConstantValue(container);

  const containerFactory = vi.fn();
  container.bind('ContainerFactory').toConstantValue(containerFactory);

  containerFactory.mockResolvedValue(container);

  const logger = mock<ILogger>();
  container.bind('Logger').toConstantValue(logger);

  const commandBus = mock<ICommandBus>();
  const queryBus = mock<IQueryBus>();

  const decoratorManager = mock<IDecoratorManager>();

  container.bind('CommandBus').toConstantValue(commandBus);
  container.bind('QueryBus').toConstantValue(queryBus);
  container.bind('DecoratorManager').toConstantValue(decoratorManager);

  await container.getAsync('Bootstrapper');
  await container.load(overridesModule);
  const server = await container.getAsync('AppServer');

  return {
    server,
    commandBus,
    queryBus,
    port: freePort,
    logger,
    eventBus,
    containerFactory,
  };
};
