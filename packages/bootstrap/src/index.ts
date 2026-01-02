export { module, AbstractError, ConfigValue, bootstrapModule } from '@lib';
export type { IBootstrapTypes, IBootstrapper, ILogger } from '@types';

export {
  type IDecoratorManager,
  priority,
  type BindingMap,
  DecoratorManager,
} from '@decorator-manager';

export { containerWithMockedBootstrapDepsBound } from '@test-helpers';
