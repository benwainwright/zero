import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import type { IAuthTypes } from './i-auth-types.ts';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IBootstrapTypes & IAuthTypes
>;

export const multiInject = inversifyInject as TypedMultiInject<
  IApplicationTypes & IBootstrapTypes & IAuthTypes
>;
