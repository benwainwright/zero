import { CreateUserCommandHandler } from '@services';
import { module, type IBootstrapTypes } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import { bootstrapAdminUser, type IAuthTypes } from '@core';

export const authModule = module<
  IApplicationTypes & IBootstrapTypes & IAuthTypes
>(({ load, bootstrapper, container }) => {
  load.bind('CommandHandler').to(CreateUserCommandHandler);
  load.bind('CommandHandler').to(CreateUserCommandHandler);

  bootstrapAdminUser(bootstrapper, container);
});
