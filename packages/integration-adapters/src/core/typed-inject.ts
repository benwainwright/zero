import { inject as inversifyInject } from 'inversify';
import { multiInject as inverifyMultiInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IInternalTypes } from './i-internal-types.ts';
import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IInternalTypes & IBootstrapTypes
>;

export const multiInject = inverifyMultiInject as TypedMultiInject<
  IApplicationTypes & IInternalTypes & IBootstrapTypes
>;
