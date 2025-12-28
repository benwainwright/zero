import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IServerInternalTypes } from './i-server-internal-types.ts';
import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IServerInternalTypes & IBootstrapTypes
>;

export const multiInject = inversifyInject as TypedMultiInject<
  IApplicationTypes & IServerInternalTypes & IBootstrapTypes
>;
