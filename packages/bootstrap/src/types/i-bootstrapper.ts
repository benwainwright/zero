import type { BindingMap } from '@decorator-manager';
import type { IModule } from './i-module.ts';

export interface IBootstrapper {
  addModule<TTypeMap extends BindingMap>(callback: IModule<TTypeMap>): void;
  start(): Promise<void>;
}
