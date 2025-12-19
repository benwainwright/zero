import { module, type IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import { type IAuthTypes } from '@core';
import { bootstrapInitialUsersAndPermissions } from '@bootstrap';
import { bindServices } from '@services';

export const authModule = module<
  IApplicationTypes & IBootstrapTypes & IAuthTypes
>(({ load, bootstrapper, container }) => {
  bootstrapInitialUsersAndPermissions(bootstrapper, container);
  bindServices(load);
});
