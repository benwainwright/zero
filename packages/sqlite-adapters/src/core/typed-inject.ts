import { inject as inversifyInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';
import type { IInternalTypes } from './i-internal-types.ts';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IInternalTypes
>;

export const multiInject = inversifyInject as TypedMultiInject<
  IApplicationTypes & IInternalTypes
>;
