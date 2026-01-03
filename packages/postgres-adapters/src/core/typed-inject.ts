import {
  inject as inversifyInject,
  multiInject as inversifyMultiInject,
} from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IApplicationTypes } from '@zero/application-core';
import type { IInternalTypes } from '../types/i-internal-types.ts';
import type { IBootstrapTypes } from '@zero/bootstrap';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IInternalTypes & IBootstrapTypes
>;

export const multiInject = inversifyMultiInject as TypedMultiInject<
  IApplicationTypes & IInternalTypes & IBootstrapTypes
>;
