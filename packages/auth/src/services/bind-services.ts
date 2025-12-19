import type { TypedContainerModuleLoadOptions } from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';
import type { IBootstrapTypes } from '@zero/bootstrap';

import {
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  GetCurrentUserQueryHandler,
} from '@services';

import type { IAuthTypes } from '@core';
import { LoginCommandHandler } from './command-handlers/login-command-handler.ts';
import { LogoutCommandHandler } from './command-handlers/logout-command-handler.ts';

export const bindServices = (
  load: TypedContainerModuleLoadOptions<
    IApplicationTypes & IBootstrapTypes & IAuthTypes
  >
) => {
  load.bind('CommandHandler').to(CreateUserCommandHandler);
  load.bind('CommandHandler').to(DeleteUserCommandHandler);
  load.bind('CommandHandler').to(LoginCommandHandler);
  load.bind('CommandHandler').to(LogoutCommandHandler);
  load.bind('QueryHandler').to(GetCurrentUserQueryHandler);
};
