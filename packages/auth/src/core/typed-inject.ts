import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import type { IAuthPorts } from './i-auth-types.ts';
import type { IAuthExports } from './i-auth-exports.ts';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IBootstrapTypes & IAuthPorts & IAuthExports
>;

export const multiInject = inversifyInject as TypedMultiInject<
  IApplicationTypes & IBootstrapTypes & IAuthPorts & IAuthExports
>;
