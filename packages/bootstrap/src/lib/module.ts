import type { BindingMap, IDecoratorManager } from '@decorator-manager';
import {
  TypedContainerModule,
  type TypedContainerModuleLoadOptions,
  TypedContainer,
} from '@inversifyjs/strongly-typed';
import type { ILogger, IBootstrapper, IBootstrapTypes } from '@types';

export const module = <TTypeMap extends BindingMap>(
  callback: ({
    load,
    bootstrapper,
    container,
    logger,
    decorators,
  }: {
    load: TypedContainerModuleLoadOptions<
      TTypeMap & IBootstrapTypes<TTypeMap & IBootstrapTypes>
    >;
    bootstrapper: IBootstrapper;
    logger: ILogger;
    container: TypedContainer<TTypeMap & IBootstrapTypes>;
    decorators: IDecoratorManager<TTypeMap & IBootstrapTypes>;
  }) => void
) => {
  return new TypedContainerModule<TTypeMap & IBootstrapTypes>((load) => {
    load.onActivation('Bootstrapper', (context, bootstrapper) => {
      const container =
        context.get<TypedContainer<TTypeMap & IBootstrapTypes>>('Container');
      const logger = container.get('Logger');
      const decorators = container.get('DecoratorManager');
      callback({ load, bootstrapper, logger, container, decorators });
      return bootstrapper;
    });
  });
};
