import type { IAccountEvents } from '@account';
import type { IBankConnectionEvents } from '@bank-connection';
import type { IRoleEvents } from '@role';
import type { ITransactionEvents } from '@transaction';
import type { IUserEvents } from '@user';

export type IDomainEvents = IUserEvents &
  IBankConnectionEvents &
  IRoleEvents &
  ITransactionEvents &
  IAccountEvents;
