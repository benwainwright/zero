import type { BindingMap } from '@decorator-manager';
import type { IBootstrapTypes } from './i-bootstrap-types.ts';
import type { TypedContainer } from '@inversifyjs/strongly-typed';

export type RequestCallback<TTypeMap extends BindingMap> = (
  container: TypedContainer<TTypeMap & IBootstrapTypes>
) => Promise<void>;
