import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IBootstrapTypes } from './i-bootstrap-types.ts';
import type { BindingMap } from '@decorator-manager';

export interface IRequestExecutor {
  executeRequestCallbacks<TTypeMap extends BindingMap>(
    requestContainer: TypedContainer<TTypeMap & IBootstrapTypes>
  ): Promise<void>;
}
