import type { IBankConnectionEvents } from '@bank-connection';
import type { IUserEvents } from '@user';

export type IDomainEvents = IUserEvents & IBankConnectionEvents;
