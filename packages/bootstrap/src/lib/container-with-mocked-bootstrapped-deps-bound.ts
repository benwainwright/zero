import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IBootstrapper, IBootstrapTypes, ILogger } from '@types';
import { mock } from 'vitest-mock-extended';

export const containerWithMockedBootstrapDepsBound = () => {
  const container = new TypedContainer<IBootstrapTypes>();
  const bootstrapper = mock<IBootstrapper>();
  container.bind('Bootstrapper').toConstantValue(bootstrapper);
  const logger = mock<ILogger>();
  container.bind('Logger').toConstantValue(logger);
  container.bind('Container').toConstantValue(container);
  return { container, logger, bootstrapper };
};
