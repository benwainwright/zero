import type { ZodType, core } from 'zod';

import type { ConfigValue } from '@lib';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IBootstrapTypes } from './i-bootstrap-types.ts';
import type { BindingMap } from '@decorator-manager';
import type { RequestCallback } from './request-callback.ts';

export interface IBootstrapper {
  configValue<TConfigValue extends ZodType>(config: {
    namespace: string;
    key: string;
    schema: TConfigValue;
    description: string;
  }): ConfigValue<core.output<TConfigValue>>;

  addInitStep(callback: () => Promise<void>): void;

  executeRequestCallbacks<TTypeMap extends BindingMap>(
    requestContainer: TypedContainer<TTypeMap & IBootstrapTypes>
  ): Promise<void>;

  onRequest<TTypeMap extends BindingMap>(
    callback: RequestCallback<TTypeMap>
  ): void;

  start(): Promise<void>;
}
