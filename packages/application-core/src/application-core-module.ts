import {
  CommandBus,
  DomainEventStore,
  QueryBus,
  SessionStorage,
  TransactionalServiceBus,
} from '@core';
import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { ISessionIdRequester } from '@ports';
import { type IApplicationTypes } from '@types';
import { module, type IBootstrapTypes } from '@zero/bootstrap';

export const applicationCoreModule = module<IApplicationTypes>(
  ({ load, container }) => {
    container.bind('DomainEventBuffer').to(DomainEventStore).inRequestScope();
    container.bind('DomainEventEmitter').toService('DomainEventBuffer');
    load.bind('RootCommandBus').to(CommandBus).inRequestScope();
    load.bind('CommandBus').to(TransactionalServiceBus).inRequestScope();
    load.bind('QueryBus').to(QueryBus);

    load.bind('ContainerFactory').toFactory(() => {
      return async (sessionIdRequester: ISessionIdRequester) => {
        const requestContainer = new TypedContainer<
          IApplicationTypes & IBootstrapTypes
        >({
          parent: container,
          defaultScope: 'Request',
        });

        const parentEventBus = await container.getAsync('EventBus');

        requestContainer
          .bind('CurrentUserSetter')
          .to(SessionStorage)
          .inRequestScope();

        requestContainer
          .bind('SessionStore')
          .to(SessionStorage)
          .inRequestScope();
        requestContainer
          .bind('SessionIdRequester')
          .toConstantValue(sessionIdRequester);
        const hasher = await container.getAsync('StringHasher');
        const logger = await container.getAsync('Logger');
        const sessionId = await sessionIdRequester.getSessionId();

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
  }
);
