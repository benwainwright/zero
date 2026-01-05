import type { BindingMap } from '@decorator-manager';
import type {
  Bind,
  RebindSync,
  TypedContainer,
} from '@inversifyjs/strongly-typed';
import type { ILogger } from './i-logger.ts';
import type {
  ContainerBinding,
  MappedServiceIdentifier,
} from '../decorator-manager/inversify-types.ts';
import type { GetOptions, Newable } from 'inversify';
import type { core, ZodType } from 'zod';
import type { ConfigValue } from '@lib';
import type { RequestCallback } from './request-callback.ts';

export interface IModuleContext<TTypeMap extends BindingMap> {
  configValue<TConfigValue extends ZodType>(config: {
    namespace: string;
    key: string;
    schema: TConfigValue;
    description: string;
  }): ConfigValue<core.output<TConfigValue>>;

  onInit(callback: () => Promise<void>): void;

  rebindSync: RebindSync<TTypeMap>;
  bind: Bind<TTypeMap>;
  get: <
    TBound extends ContainerBinding<TTypeMap, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey extends MappedServiceIdentifier<TTypeMap> = any
  >(
    serviceIdentifier: TKey,
    options?: GetOptions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => TBound extends Promise<any> ? never : TBound;

  getAsync: <
    TBound extends ContainerBinding<TTypeMap, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey extends MappedServiceIdentifier<TTypeMap> = any
  >(
    serviceIdentifier: TKey,
    options?: GetOptions
  ) => Promise<TBound>;

  container: TypedContainer<TTypeMap>;

  onRequest(callback: RequestCallback<TTypeMap>): void;

  logger: ILogger;

  decorate<TKey extends keyof TTypeMap & string>(
    token: TKey,
    thing: Newable<ContainerBinding<Partial<TTypeMap>, TKey>>
  ): void;
}

export type IModule<TTypeMap extends BindingMap> = (
  config: IModuleContext<TTypeMap>
) => Promise<void>;
