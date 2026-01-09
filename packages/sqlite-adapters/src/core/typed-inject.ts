import {
  inject as inversifyInject,
  multiInject as inversifyMultiInject,
} from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';
import type { IInternalTypes } from './i-internal-types.ts';
import type { IKyselySharedTypes } from '@zero/kysely-shared';
import type { DB } from './database.ts';

export const inject = inversifyInject as TypedInject<
  IApplicationTypes & IInternalTypes & IKyselySharedTypes<DB>
>;

export const multiInject = inversifyMultiInject as TypedMultiInject<
  IApplicationTypes & IInternalTypes & IKyselySharedTypes<DB>
>;
