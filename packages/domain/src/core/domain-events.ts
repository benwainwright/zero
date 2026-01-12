import type { IAccountEvents } from '@account';
import type { IBankConnectionEvents } from '@bank-connection';
import type { CategoryEvents } from '@category';
import type { IOauthTokenEvents } from '@oauth-token';
import type { IRoleEvents } from '@role';
import type { SyncDetailsEvents } from '@sync-details';
import type { ITransactionEvents } from '@transaction';
import type { IUserEvents } from '@user';

export type IDomainEvents = IUserEvents &
  IBankConnectionEvents &
  IRoleEvents &
  ITransactionEvents &
  IAccountEvents &
  IOauthTokenEvents &
  SyncDetailsEvents &
  CategoryEvents;
