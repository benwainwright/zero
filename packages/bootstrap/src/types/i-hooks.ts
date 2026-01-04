import type { BindingMap } from '@decorator-manager';
import type { RequestCallback } from './request-callback.ts';

export interface IHooks<TTypeMap extends BindingMap> {
  onRequest(callback: RequestCallback<TTypeMap>): void;
  onInit(callback: () => Promise<void>): void;
}
