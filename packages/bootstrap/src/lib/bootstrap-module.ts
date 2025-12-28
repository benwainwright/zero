import { TypedContainerModule } from '@inversifyjs/strongly-typed';
import type { IBootstrapTypes, IInternalTypes } from '@types';
import { getWinstonLogger } from './get-winston-logger.ts';
import { Bootstrapper } from './bootstrapper.ts';
import { DecoratorManager } from '@decorator-manager';

export const bootstrapModule = new TypedContainerModule<
  IBootstrapTypes & IInternalTypes
>((load) => {
  const logger = getWinstonLogger();
  logger.info(`Starting application`);

  load.bind('ConfigFile').toConstantValue('zero.config.json');
  logger.info(`Initialising bootstrap module`);

  load.bind('Logger').toConstantValue(logger);
  load.bind('Bootstrapper').to(Bootstrapper);
  load.bind('DecoratorManager').to(DecoratorManager).inRequestScope();

  logger.debug(`Finished initialising bootstrap module`);
});
