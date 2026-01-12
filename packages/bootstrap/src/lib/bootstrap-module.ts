import { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IBootstrapTypes, IInternalTypes } from '@types';
import { getWinstonLogger } from './get-winston-logger.ts';
import { Bootstrapper } from './bootstrapper.ts';
import { DecoratorManager } from '@decorator-manager';

export const getBootstrapper = async (configFile: string) => {
  const container = new TypedContainer<IBootstrapTypes & IInternalTypes>({
    defaultScope: 'Request',
  });
  const logger = getWinstonLogger();
  logger.info(`Starting application`);
  container.bind('Logger').toConstantValue(logger);
  container.bind('ConfigFile').toConstantValue(configFile);
  container.bind('Bootstrapper').to(Bootstrapper).inSingletonScope();
  container.bind('Hooks').toService('Bootstrapper');
  container.bind('RequestExecutor').toService('Bootstrapper');
  logger.info(`Initialising bootstrap module`);
  container.bind('DecoratorManager').to(DecoratorManager).inSingletonScope();
  logger.debug(`Finished initialising bootstrap module`);

  container.bind('Container').toConstantValue(container);
  return await container.getAsync('Bootstrapper');
};
