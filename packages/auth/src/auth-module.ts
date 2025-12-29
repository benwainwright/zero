import { module, type IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import {
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
>(async ({ load, bootstrapper, container, decorators }) => {
  container.bind('CurrentUserCache').to(SessionStorage).inRequestScope();
  container.bind('CurrentUserSetter').toService('CurrentUserCache');
  container.bind('SessionStore').toService('CurrentUserCache');

  bootstrapInitialUsersAndPermissions(bootstrapper, container);
  bindServices(load);
  load.bind('GrantService').to(GrantService);
  await decorators.decorate('CommandBus', AuthorisingCommandBus);
  await decorators.decorate('QueryBus', AuthorisingQueryBus);
});
