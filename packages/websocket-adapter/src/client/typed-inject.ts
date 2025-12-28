import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IClientInternalTypes } from './i-client-internal-types.ts';
import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import type { IClientTypes } from './i-client-types.ts';

export const inject = inversifyInject as TypedInject<
  IClientInternalTypes & IBootstrapTypes & IApplicationTypes & IClientTypes
>;

export const multiInject = inversifyInject as TypedMultiInject<
  IClientInternalTypes & IBootstrapTypes & IApplicationTypes & IClientTypes
>;
