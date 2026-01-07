import type { Newable } from 'inversify';
import 'reflect-metadata';

const INVERSIFY_METADATA_KEY = '@inversifyjs/core/classMetadataReflectKey';

interface BaseClassElementMetadata<TKind> {
  kind: TKind;
}

declare enum ClassElementMetadataKind {
  multipleInjection = 0,
  singleInjection = 1,
  unmanaged = 2,
}

type ServiceIdentifier<TInstance = unknown> =
  | string
  | symbol
  | Newable<TInstance>
  | AbstractNewable<TInstance>;

type AbstractNewable<
  TInstance = unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends unknown[] = any[]
> = abstract new (...args: TArgs) => TInstance;

type MetadataTag = number | string | symbol;

type MetadataName = number | string | symbol;

export interface ConstructorArgument
  extends BaseClassElementMetadata<ClassElementMetadataKind.singleInjection> {
  isFromTypescriptParamType?: true;
  name: MetadataName | undefined;
  optional: boolean;
  tags: Map<MetadataTag, unknown>;
  value: ServiceIdentifier;
}

const isConstructorArgument = (
  value: unknown
): value is ConstructorArgument => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    'value' in value &&
    'optional' in value &&
    'tags' in value &&
    'kind' in value
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const getConstructorArguments = (thing: Newable<unknown>) => {
  const meta = Reflect.getMetadata(INVERSIFY_METADATA_KEY, thing);
  if (!isRecord(meta)) {
    return [];
  }

  const constructorArguments = meta['constructorArguments'];

  if (!Array.isArray(constructorArguments)) {
    return [];
  }

  return constructorArguments.filter(isConstructorArgument);
};
