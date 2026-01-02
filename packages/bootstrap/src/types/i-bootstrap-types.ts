import type { IBootstrapper } from './i-bootstrapper.ts';
import type {
  BindingMap,
  IDecoratorManager,
  IParentDecoratorManager,
} from '@decorator-manager';
import type { ILogger } from './i-logger.ts';
import type { TypedContainer } from '@inversifyjs/strongly-typed';

export interface IBootstrapTypes<TMap extends BindingMap = any> {
  Container: TypedContainer;
  Bootstrapper: IBootstrapper;
  Logger: ILogger;
  DecoratorManager: IDecoratorManager<TMap> & IParentDecoratorManager<TMap>;
}
