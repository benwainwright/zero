import { module, type IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import { bindServices, bootstrapAdminUser, type IAuthTypes } from '@core';

export const authModule = module<
  IApplicationTypes & IBootstrapTypes & IAuthTypes
>(({ load, bootstrapper, container }) => {
  bootstrapAdminUser(bootstrapper, container);
  bindServices(load);
});
