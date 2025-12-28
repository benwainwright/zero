import type { core } from 'zod';

import type { ConfigValue } from '@lib';

export interface IBootstrapper {
  configValue<TConfigValue extends core.$ZodType>(config: {
    namespace: string;
    key: string;
    schema: TConfigValue;
    description: string;
  }): ConfigValue<core.output<TConfigValue>>;

  addInitStep(callback: () => Promise<void>): void;

  start(): Promise<void>;
}
