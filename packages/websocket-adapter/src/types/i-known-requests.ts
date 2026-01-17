import type { AccountsCommands, AccountsQueries } from '@zero/accounts';
import type { AuthCommands, AuthQueries } from '@zero/auth';

export type IKnownRequests =
  | AuthCommands
  | AccountsCommands
  | AuthQueries
  | AccountsQueries;
