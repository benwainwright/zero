import {
  inject as inversifyInject,
  multiInject as inversifyMultiInject,
} from 'inversify';

import type { IApplicationTypes } from '@zero/application-core';

import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IAccountsTypes } from './i-accounts-types.ts';
import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IAuthExports } from '@zero/auth';

export const inject = inversifyInject as TypedInject<
  IAccountsTypes & IBootstrapTypes & IApplicationTypes & IAuthExports
>;

export const multiInject = inversifyMultiInject as TypedMultiInject<
  IAccountsTypes & IBootstrapTypes & IApplicationTypes & IAuthExports
>;
