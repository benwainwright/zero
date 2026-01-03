import { module, type IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import {
  UserRepositoryAuthEventStager,
  AuthorisingCommandBus,
  AuthorisingQueryBus,
  GrantService,
  SessionStorage,
  type IAuthExports,
  type IAuthTypes,
} from '@core';
import { bootstrapInitialUsersAndPermissions } from '@bootstrap';
import { bindServices } from '@services';

export const authModule = module<
  IApplicationTypes & IBootstrapTypes & IAuthTypes & IAuthExports
>(async ({ load, bootstrapper, container, decorators, logger }) => {
  logger.info(`Initialising auth module`);
  container.bind('CurrentUserCache').to(SessionStorage).inRequestScope();
  container.bind('CurrentUserSetter').toService('CurrentUserCache');
  container.bind('SessionStore').toService('CurrentUserCache');

  bootstrapInitialUsersAndPermissions(bootstrapper, container);
  bindServices(load);

  bootstrapper.onRequest<IAuthExports>(async (container) => {
    container.unbindSync('GrantService');
    container.bind('GrantService').to(GrantService).inRequestScope();
  });

  decorators.decorate('QueryBus', AuthorisingQueryBus);
  decorators.decorate('CommandBus', AuthorisingCommandBus);
  decorators.decorate('UserRepository', UserRepositoryAuthEventStager);
});
