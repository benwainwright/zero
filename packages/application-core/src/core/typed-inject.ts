import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@types';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IBootstrapTypes
>;

export const multiInject = inversifyInject as TypedMultiInject<
  IApplicationTypes & IBootstrapTypes
>;
