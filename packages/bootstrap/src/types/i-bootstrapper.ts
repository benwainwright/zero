import * as z4 from 'zod/v4/core';

import type { ConfigValue } from '@lib';
import type { ServiceIdentifier } from 'inversify';

export interface IBootstrapper {
  configValue<TConfigValue extends z4.$ZodType>(
    key: string,
    schema: TConfigValue
  ): ConfigValue<z4.output<TConfigValue>>;

  addInitStep(callback: () => Promise<void>): void;

  start(): Promise<void>;
}

export const BootstrapperToken: ServiceIdentifier<IBootstrapper> =
  Symbol.for('Bootstrapper');
