import {
  inject as inversifyInject,
  multiInject as inversifyMultiInject,
} from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IApplicationTypes } from '@zero/application-core';
import type { IBootstrapTypes } from '@zero/bootstrap';
import type { IKyselySharedTypes } from './i-kysely-shared-types.ts';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IBootstrapTypes & IKyselySharedTypes<unknown>
>;

export const multiInject = inversifyMultiInject as TypedMultiInject<
  IApplicationTypes & IBootstrapTypes & IKyselySharedTypes<unknown>
>;
