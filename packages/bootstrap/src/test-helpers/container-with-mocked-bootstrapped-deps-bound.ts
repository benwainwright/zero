import type { IDecoratorManager } from '@decorator-manager';
import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IBootstrapper, IBootstrapTypes, ILogger } from '@types';
import { mock } from 'vitest-mock-extended';

export const containerWithMockedBootstrapDepsBound = () => {
  const container = new TypedContainer<IBootstrapTypes>();
  const bootstrapper = mock<IBootstrapper>();
  container.bind('Bootstrapper').toConstantValue(bootstrapper);
  const logger = mock<ILogger>();
  const decoratorManager = mock<IDecoratorManager>();
  container.bind('Logger').toConstantValue(logger);
  container.bind('Container').toConstantValue(container);
  container.bind('DecoratorManager').toConstantValue(decoratorManager);
  return { container, logger, bootstrapper };
};
