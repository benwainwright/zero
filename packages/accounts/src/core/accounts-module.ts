import type { IModule } from '@zero/bootstrap';
import type { IAccountsTypes } from './i-accounts-types.ts';
import type { IApplicationTypes } from '@zero/application-core';
import {
  CreateAccountCommandHandler,
  CreateTransactionCommandHandler,
  DeleteAccountCommandHandler,
  DeleteTransactionCommandHandler,
  GetAccountQueryHandler,
  ListTransactionsQueryHandler,
  ListUserAccountsQueryHandler,
  UpdateAccountCommandHandler,
  UpdateTransactionCommandHandler,
} from '@services';

export const accountsModule: IModule<
  IAccountsTypes & IApplicationTypes
> = async ({ bind }) => {
  bind('CommandHandler').to(CreateAccountCommandHandler);
  bind('CommandHandler').to(DeleteAccountCommandHandler);
  bind('CommandHandler').to(UpdateAccountCommandHandler);
  bind('CommandHandler').to(CreateTransactionCommandHandler);
  bind('CommandHandler').to(UpdateTransactionCommandHandler);
  bind('CommandHandler').to(DeleteTransactionCommandHandler);
  bind('QueryHandler').to(ListTransactionsQueryHandler);
  bind('QueryHandler').to(ListUserAccountsQueryHandler);
  bind('QueryHandler').to(GetAccountQueryHandler);
};
