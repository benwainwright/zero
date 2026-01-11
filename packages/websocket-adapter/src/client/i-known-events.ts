import type { IQueryResponseEvent } from '@types';
import type { AccountsEvents } from '@zero/accounts';
import type { IAllEvents } from '@zero/application-core';
import type { AuthEvents } from '@zero/auth';

export type IKnownEvents = IAllEvents &
  IQueryResponseEvent &
  AuthEvents &
  AccountsEvents;
