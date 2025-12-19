import type { TypedContainerModuleLoadOptions } from '@inversifyjs/strongly-typed';
import type { IApplicationTypes } from '@zero/application-core';
import type { IBootstrapTypes } from '@zero/bootstrap';

import {
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  GetCurrentUserQueryHandler,
} from '@services';

import type { IAuthTypes } from './i-auth-types.ts';

export const bindServices = (
  load: TypedContainerModuleLoadOptions<
    IApplicationTypes & IBootstrapTypes & IAuthTypes
  >
) => {
  load.bind('CommandHandler').to(CreateUserCommandHandler);
  load.bind('CommandHandler').to(DeleteUserCommandHandler);
  load.bind('QueryHandler').to(GetCurrentUserQueryHandler);
};
