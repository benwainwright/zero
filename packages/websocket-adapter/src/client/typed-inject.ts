import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IClientInternalTypes } from './i-client-internal-types.ts';
import type { IBootstrapTypes } from '@zero/bootstrap';

export const inject = inversifyInject as TypedInject<
  IClientInternalTypes & IBootstrapTypes
>;

export const multiInject = inversifyInject as TypedMultiInject<
  IClientInternalTypes & IBootstrapTypes
>;
