import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { Factory } from 'inversify';

import { AbstractRequestHandler, type ErrorHandler } from '@core';

import type {
  IDomainEventBuffer,
  IDomainEventStore,
  IEventBus,
  ISessionIdRequester,
  ISingleItemStore,
  IUnitOfWork,
  IObjectStorage,
  IStringHasher,
  IServiceBus,
  ICurrentUserCache,
  IUUIDGenerator,
  IWriteRepository,
  ISyncDetailsRepository,
} from '@ports';

import type { SyncDetails, User } from '@zero/domain';
import type { IRequest } from '@types';
import type { Serialiser } from '@zero/serialiser';

export interface IApplicationTypes {
  ErrorHandler: ErrorHandler;
  EventBus: IEventBus;
  CurrentUserCache: ICurrentUserCache;
  RequestHandler: AbstractRequestHandler<IRequest<string>, string>;
  UUIDGenerator: IUUIDGenerator;
  Serialiser: Serialiser;
  ServiceBus: IServiceBus;
  UnitOfWork: IUnitOfWork;
  ObjectStore: IObjectStorage;
  DomainEventBuffer: IDomainEventBuffer;
  DomainEventEmitter: IDomainEventStore;
  ContainerFactory: Factory<TypedContainer>;
  SyncDetailsRepository: ISyncDetailsRepository;
  SyncDetailsWriter: IWriteRepository<SyncDetails>;
  SessionStore: ISingleItemStore<User>;
  StringHasher: IStringHasher;
  SessionIdRequester: ISessionIdRequester;
}
