import { type PluginApi } from '@inversifyjs/plugin';
import type { MetadataName, Newable } from 'inversify';

export type GetPlanOptions = Parameters<Parameters<PluginApi['onPlan']>[0]>[0];

interface BaseClassElementMetadata<TKind> {
  kind: TKind;
}

type MetadataTag = number | string | symbol;

type ServiceIdentifier<TInstance = unknown> =
  | string
  | symbol
  | Newable<TInstance>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function;

type BindingMapProperty = string | symbol;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BindingMap = Record<BindingMapProperty, any>;

type IfAny<T, TYes, TNo> = 0 extends 1 & T ? TYes : TNo;

export type MappedServiceIdentifier<T extends BindingMap> = IfAny<
  T,
  ServiceIdentifier,
  keyof T
>;

export type ContainerBinding<
  TBindingMap extends BindingMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends MappedServiceIdentifier<TBindingMap> = any
> = TKey extends keyof TBindingMap
  ? TBindingMap[TKey]
  : TKey extends Newable<infer C>
  ? C
  : // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  TKey extends Function
  ? unknown
  : never;

declare enum ClassElementMetadataKind {
  multipleInjection = 0,
  singleInjection = 1,
  unmanaged = 2,
}

export interface ConstructorArgument
  extends BaseClassElementMetadata<ClassElementMetadataKind.singleInjection> {
  isFromTypescriptParamType?: true;
  name: MetadataName | undefined;
  optional: boolean;
  tags: Map<MetadataTag, unknown>;
  value: ServiceIdentifier;
}
