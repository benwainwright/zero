import {
  inject as inversifyInject,
  multiInject as inversifyMultiInject,
} from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IBootstrapTypes, IInternalTypes } from '@types';

export const inject: TypedInject<IBootstrapTypes & IInternalTypes> = (
  identifier
) => inversifyInject(identifier);

export const multiInject: TypedMultiInject<IBootstrapTypes> = (identifier) =>
  inversifyMultiInject(identifier);
