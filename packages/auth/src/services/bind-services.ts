import type { Bind } from '@inversifyjs/strongly-typed';
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
  bind('RequestHandler').to(CreateUserCommandHandler);
  bind('RequestHandler').to(DeleteUserCommandHandler);
  bind('RequestHandler').to(LoginCommandHandler);
  bind('RequestHandler').to(LogoutCommandHandler);
  bind('RequestHandler').to(UpdateUserCommandHandler);
  bind('RequestHandler').to(GetCurrentUserQueryHandler);
  bind('RequestHandler').to(GetUsersQueryHandler);
  bind('RequestHandler').to(GetUserQueryHandler);
  bind('RequestHandler').to(GetRolesQueryHandler);
  bind('RequestHandler').to(GetRoleQueryHandler);
};
