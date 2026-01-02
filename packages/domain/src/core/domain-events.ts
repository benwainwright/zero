import type { IBankConnectionEvents } from '@bank-connection';
import type { IRoleEvents } from '@role';
import type { IUserEvents } from '@user';

export type IDomainEvents = IUserEvents & IBankConnectionEvents & IRoleEvents;
