import type { IErrorEvents } from '@errors';
import type { IDomainEvents } from '@zero/domain';

export type IAllEvents = IDomainEvents & IErrorEvents;
