import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { Factory } from 'inversify';

import {
  AbstractCommandHandler,
  AbstractCommand,
  AbstractQueryHandler,
} from '@core';
import type {
  IDomainEventBuffer,
  IDomainEventStore,
  IEventBus,
  ISessionIdRequester,
  ISingleItemStore,
  ICommandBus,
  IUnitOfWork,
  IObjectStorage,
  IStringHasher,
  ICurrentUserSetter,
  IQueryBus,
} from '@ports';

import type { User } from '@zero/domain';
import type { IQuery } from './i-query.ts';

export interface IApplicationTypes {
  EventBus: IEventBus;
  CurrentUserSetter: ICurrentUserSetter;
  CommandHandler: AbstractCommandHandler<AbstractCommand<string>>;
  QueryHandler: AbstractQueryHandler<IQuery<unknown>>;
  RootCommandBus: ICommandBus;
  CommandBus: ICommandBus;
  QueryBus: IQueryBus;
  UnitOfWork: IUnitOfWork;
  ObjectStore: IObjectStorage;
  DomainEventBuffer: IDomainEventBuffer;
  DomainEventEmitter: IDomainEventStore;
  ContainerFactory: Factory<TypedContainer>;
  SessionStore: ISingleItemStore<User>;
  StringHasher: IStringHasher;
  SessionIdRequester: ISessionIdRequester;
}
