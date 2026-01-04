import type { IBootstrapper } from './i-bootstrapper.ts';
import type { BindingMap, IDecoratorManager } from '@decorator-manager';
import type { ILogger } from './i-logger.ts';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IRequestExecutor } from './i-request-executor.ts';
import type { IHooks } from './i-hooks.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IBootstrapTypes<TMap extends BindingMap = any> {
  Container: TypedContainer;
  Bootstrapper: IBootstrapper;
  Logger: ILogger;
  Hooks: IHooks<TMap>;
  RequestExecutor: IRequestExecutor;
  DecoratorManager: IDecoratorManager<TMap>;
}
