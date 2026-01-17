import type { IRequestResponseEvent } from '@types';
import type { AccountsEvents } from '@zero/accounts';
import type { IAllEvents } from '@zero/application-core';
import type { AuthEvents } from '@zero/auth';
import type { IntegrationEvents } from '@zero/integration-adapters';

export type IKnownEvents = IAllEvents &
  IRequestResponseEvent &
  AuthEvents &
  AccountsEvents &
  IntegrationEvents;
