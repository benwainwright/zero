export { AbstractError, ConfigValue, getBootstrapper } from '@lib';
export type {
  IModule,
  IBootstrapTypes,
  IBootstrapper,
  ILogger,
  IHooks,
} from '@types';

export {
  type IDecoratorManager,
  priority,
  type BindingMap,
  DecoratorManager,
} from '@decorator-manager';

export {
  containerWithMockedBootstrapDepsBound,
  testModule,
} from '@test-helpers';
