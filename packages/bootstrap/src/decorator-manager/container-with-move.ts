import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { BindingMap } from './inversify-types.ts';

export type ContainerWithMove<TMap extends BindingMap> =
  TypedContainer<TMap> & {
    moveBinding(from: string, to: string): Promise<void>;
  };
