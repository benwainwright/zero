import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { BindingMap } from './inversify-types.ts';

type BindingScope = 'Singleton' | 'Transient' | 'Request';

export type ContainerWithMove<TMap extends BindingMap> =
  TypedContainer<TMap> & {
    getBindingScope(token: string): BindingScope;
    moveBinding(
      from: string,
      to: string
    ): { type: 'Instance'; scope: BindingScope };
  };
