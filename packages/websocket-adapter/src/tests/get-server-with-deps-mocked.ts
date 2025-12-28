import {
  TypedContainer,
  TypedContainerModule,
} from '@inversifyjs/strongly-typed';
import { type IServerInternalTypes, websocketServerModule } from '@server';
import { mock } from 'vitest-mock-extended';

import {
  type ICommandBus,
  type IApplicationTypes,
  type IQueryBus,
  type ISessionIdRequester,
} from '@zero/application-core';
import {
  ConfigValue,
  type IBootstrapper,
  type ILogger,
  type IBootstrapTypes,
  type IDecoratorManager,
} from '@zero/bootstrap';

import getPort from 'get-port';

export const getServerWithDepsMocked = async () => {
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

  await container.load(overridesModule);

  const bootstrapper = mock<IBootstrapper>();
  container.bind('Bootstrapper').toConstantValue(bootstrapper);
  container.bind('Container').toConstantValue(container);

  const containerFactory =
    mock<
      (
        sessionIdRequester: ISessionIdRequester
      ) => Promise<TypedContainer<IServerInternalTypes>>
    >();

  container.bind('ContainerFactory').toConstantValue(containerFactory);

  const logger = mock<ILogger>();
  container.bind('Logger').toConstantValue(logger);

  const commandBus = mock<ICommandBus>();
  const queryBus = mock<IQueryBus>();

  const decoratorManager = mock<IDecoratorManager>();

  container.bind('CommandBus').toConstantValue(commandBus);
  container.bind('QueryBus').toConstantValue(queryBus);
  container.bind('DecoratorManager').toConstantValue(decoratorManager);

  await container.getAsync('Bootstrapper');
  const server = await container.getAsync('AppServer');

  return {
    server,
    commandBus,
    queryBus,
    port: freePort,
    logger,
    containerFactory,
  };
};
