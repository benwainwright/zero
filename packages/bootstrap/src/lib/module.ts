import {
  TypedContainerModule,
  type TypedContainerModuleLoadOptions,
  TypedContainer,
} from '@inversifyjs/strongly-typed';
import type { ILogger, IBootstrapper, IBootstrapTypes } from '@types';

export const module = <TTypeMap>(
  callback: ({
    load,
    bootstrapper,
    container,
    logger,
  }: {
    load: TypedContainerModuleLoadOptions<TTypeMap & IBootstrapTypes>;
    bootstrapper: IBootstrapper;
    logger: ILogger;
    container: TypedContainer<TTypeMap & IBootstrapTypes>;
  }) => void
) => {
  return new TypedContainerModule<TTypeMap & IBootstrapTypes>((load) => {
    load.onActivation('Bootstrapper', (context, bootstrapper) => {
      const container =
        context.get<TypedContainer<TTypeMap & IBootstrapTypes>>('Container');
      const logger = container.get('Logger');
      callback({ load, bootstrapper, logger, container });
      return bootstrapper;
    });
  });
};
