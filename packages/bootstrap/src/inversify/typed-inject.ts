import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IBootstrapTypes, IInternalTypes } from '@types';

export const inject = inversifyInject as TypedInject<
  IBootstrapTypes & IInternalTypes
>;

export const multiInject = inversifyInject as TypedMultiInject<IBootstrapTypes>;
