import type { IErrorEvents } from '@errors';
import type { IDomainEvents } from '@zero/domain';
import type { ICoreEvents } from './core-events.ts';

export type IAllEvents = IDomainEvents & IErrorEvents & ICoreEvents;
