import { inject as inversifyInject } from 'inversify';
import { multiInject as inverifyMultiInject } from 'inversify';
import type {
  TypedInject,
  TypedMultiInject,
} from '@inversifyjs/strongly-typed';

import type { IInternalTypes } from './i-internal-types.ts';
import type { IBootstrapTypes } from '@zero/bootstrap';
import type {
  IAllEvents,
  IApplicationTypes,
  IEventBus,
} from '@zero/application-core';
import type { IntegrationEvents } from '../adapter-events.ts';

export const inject = inversifyInject as TypedInject<
  Omit<IApplicationTypes, 'EventBus'> & {
    EventBus: IEventBus<IntegrationEvents & IAllEvents>;
  } & IInternalTypes &
    IBootstrapTypes
>;

export const multiInject = inverifyMultiInject as TypedMultiInject<
  IApplicationTypes & IInternalTypes & IBootstrapTypes
>;
