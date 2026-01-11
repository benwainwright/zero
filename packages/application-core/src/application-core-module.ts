import {
  CommandBus,
  DomainEventStore,
  ErrorHandler,
  QueryBus,
  TransactionalCommandBus,
  TransactionalQueryBus,
} from '@core';
import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { ISessionIdRequester } from '@ports';
import { type IApplicationTypes } from '@types';
import { type IBootstrapTypes, type IModule } from '@zero/bootstrap';
import { Serialiser } from '@zero/serialiser';

export const applicationCoreModule: IModule<
  IApplicationTypes & IBootstrapTypes
> = async ({ decorate, logger, bind, container, getAsync }) => {
  logger.info(`Initialising application core module`);
  bind('DomainEventBuffer').to(DomainEventStore).inRequestScope();
  bind('DomainEventEmitter').toService('DomainEventBuffer');
  bind('Serialiser').to(Serialiser);
  bind('CommandBus').to(CommandBus).inRequestScope();
  bind('QueryBus').to(QueryBus).inRequestScope();
  bind('ErrorHandler').to(ErrorHandler);

  decorate('CommandBus', TransactionalCommandBus);
  decorate('QueryBus', TransactionalQueryBus);

  bind('ContainerFactory').toFactory(() => {
    return async (sessionIdRequester: ISessionIdRequester) => {
      const requestContainer = new TypedContainer<
        IApplicationTypes & IBootstrapTypes
      >({
        parent: container,
        defaultScope: 'Request',
      });

      const requestExecutor = await getAsync('RequestExecutor');
      await requestExecutor.executeRequestCallbacks(requestContainer);

      const parentEventBus = await getAsync('EventBus');

      requestContainer
        .bind('SessionIdRequester')
        .toConstantValue(sessionIdRequester);

      const hasher = await getAsync('StringHasher');
      const logger = await getAsync('Logger');
      const sessionId = await sessionIdRequester.getSessionId();

      requestContainer
        .rebindSync('Container')
        .toConstantValue(requestContainer);

      requestContainer.bind('Logger').toConstantValue(
        logger.child({
          session: hasher.md5(sessionId),
        })
      );

      requestContainer
        .bind('EventBus')
        .toConstantValue(parentEventBus.child(sessionId));

      return requestContainer;
    };
  });
};
