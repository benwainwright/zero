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
  | Function;

type BindingMapProperty = string | symbol;
export type BindingMap = Record<BindingMapProperty, unknown>;

type IfAny<T, TYes, TNo> = 0 extends 1 & T ? TYes : TNo;

type MappedServiceIdentifier<T extends BindingMap> = IfAny<
  T,
  ServiceIdentifier,
  keyof T
>;

export type ContainerBinding<
  TBindingMap extends BindingMap,
  TKey extends MappedServiceIdentifier<TBindingMap> = MappedServiceIdentifier<TBindingMap>
> = TKey extends keyof TBindingMap
  ? TBindingMap[TKey]
  : TKey extends Newable<infer C>
  ? C
  : TKey extends Function
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
