import {
  CommandBus,
  DomainEventStore,
  QueryBus,
  TransactionalServiceBus,
} from '@core';
import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { ISessionIdRequester } from '@ports';
import { type IApplicationTypes } from '@types';
import { module, type IBootstrapTypes } from '@zero/bootstrap';
import { Serialiser } from '@zero/serialiser';

export const applicationCoreModule = module<IApplicationTypes>(
  async ({ load, container, decorators }) => {
    container.bind('DomainEventBuffer').to(DomainEventStore).inRequestScope();
    container.bind('DomainEventEmitter').toService('DomainEventBuffer');
    load.bind('Serialiser').to(Serialiser);
    load.bind('CommandBus').to(CommandBus).inRequestScope();
    load.bind('QueryBus').to(QueryBus).inRequestScope();
    await decorators.decorate('CommandBus', TransactionalServiceBus);

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
