import { type IBootstrapper, type ILogger, type IBootstrapTypes } from '@types';
import { mock } from 'vitest-mock-extended';
import { module } from './module.ts';
import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IDecoratorManager } from '@decorator-manager';
describe('module', () => {
  it('triggers the callback once the bootstrapper is resolved and passes through the bootstrapper, container and logger', async () => {
    const mockCallback = vi.fn();
    const logger = mock<ILogger>();
    const bootstrapper = mock<IBootstrapper>();
    const theModule = module(mockCallback);
    const decoratorManager = mock<IDecoratorManager>();

    const container = new TypedContainer<IBootstrapTypes>();
    container.bind('Container').toConstantValue(container);
    container.bind('Logger').toConstantValue(logger);
    container.bind('Bootstrapper').toConstantValue(bootstrapper);
    container.bind('DecoratorManager').toConstantValue(decoratorManager);

    await container.load(theModule);

    expect(mockCallback).not.toHaveBeenCalled();

    container.get('Bootstrapper');

    expect(mockCallback).toHaveBeenCalled();
  });
});
