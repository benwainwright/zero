import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { Factory } from 'inversify';

import { AbstractCommandHandler, AbstractQueryHandler } from '@core';
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
  IQueryBus,
  ICurrentUserCache,
} from '@ports';

import type { User } from '@zero/domain';
import type { ICommand } from './i-command.ts';
import type { IQuery } from '@types';
import type { Serialiser } from '@zero/serialiser';

export interface IApplicationTypes {
  EventBus: IEventBus;
  CommandHandler: AbstractCommandHandler<ICommand<string>, string>;
  CurrentUserCache: ICurrentUserCache;
  QueryHandler: AbstractQueryHandler<IQuery<string>, string>;
  CommandBus: ICommandBus;
  Serialiser: Serialiser;
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
