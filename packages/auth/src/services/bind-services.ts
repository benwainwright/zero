import type { Bind, TypedContainer } from '@inversifyjs/strongly-typed';
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
import { UpdateUserCommandHandler } from './command-handlers/update-user-command-handler.ts';
import { GetUsersQueryHandler } from './query-handlers/get-users-query-handler.ts';
import { GetUserQueryHandler } from './query-handlers/get-user-query-handler.ts';
import { GetRolesQueryHandler } from './query-handlers/get-roles-query-handler.ts';
import { GetRoleQueryHandler } from './query-handlers/get-role-query-handler.ts';

export const bindServices = (
  bind: Bind<IApplicationTypes & IBootstrapTypes & IAuthTypes>
) => {
  bind('CommandHandler').to(CreateUserCommandHandler);
  bind('CommandHandler').to(DeleteUserCommandHandler);
  bind('CommandHandler').to(LoginCommandHandler);
  bind('CommandHandler').to(LogoutCommandHandler);
  bind('CommandHandler').to(UpdateUserCommandHandler);

  bind('QueryHandler').to(GetCurrentUserQueryHandler);
  bind('QueryHandler').to(GetUsersQueryHandler);
  bind('QueryHandler').to(GetUserQueryHandler);
  bind('QueryHandler').to(GetRolesQueryHandler);
  bind('QueryHandler').to(GetRoleQueryHandler);
};
