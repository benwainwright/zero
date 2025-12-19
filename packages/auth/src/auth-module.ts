import { module, type IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import {
  AuthorisingCommandBus,
  AuthorisingQueryBus,
  type IAuthExports,
  type IAuthTypes,
} from '@core';
import { bootstrapInitialUsersAndPermissions } from '@bootstrap';
import { bindServices } from '@services';

export const authModule = module<
  IApplicationTypes & IBootstrapTypes & IAuthTypes & IAuthExports
>(async ({ load, bootstrapper, container, decorators }) => {
  bootstrapInitialUsersAndPermissions(bootstrapper, container);
  bindServices(load);
  await decorators.decorate('CommandBus', AuthorisingCommandBus);
  await decorators.decorate('QueryBus', AuthorisingQueryBus);
});
