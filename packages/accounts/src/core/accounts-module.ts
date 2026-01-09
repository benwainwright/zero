import type { IModule } from '@zero/bootstrap';
import type { IAccountsTypes } from './i-accounts-types.ts';
import type { IApplicationTypes } from '@zero/application-core';
import {
  CreateAccountCommandHandler,
  DeleteAccountCommandHandler,
  GetAccountQueryHandler,
  ListUserAccountsQueryHandler,
  UpdateAccountCommandHandler,
} from '@services';
import { AccountsRepositoryEventsStager } from '@core';

export const accountsModule: IModule<
  IAccountsTypes & IApplicationTypes
> = async ({ bind, decorate }) => {
  bind('CommandHandler').to(CreateAccountCommandHandler);
  bind('CommandHandler').to(DeleteAccountCommandHandler);
  bind('CommandHandler').to(UpdateAccountCommandHandler);
  bind('QueryHandler').to(ListUserAccountsQueryHandler);
  bind('QueryHandler').to(GetAccountQueryHandler);
  decorate('AccountRepository', AccountsRepositoryEventsStager);
};
