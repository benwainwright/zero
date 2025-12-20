import * as z4 from 'zod/v4/core';

import type { ConfigValue } from '@lib';

export interface IBootstrapper {
  configValue<TConfigValue extends z4.$ZodType>(config: {
    namespace: string;
    key: string;
    schema: TConfigValue;
    description: string;
  }): ConfigValue<z4.output<TConfigValue>>;

  addInitStep(callback: () => Promise<void>): void;

  start(): Promise<void>;
}
