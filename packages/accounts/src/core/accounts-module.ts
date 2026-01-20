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
  OpenBankingTokenManager,
  UpdateCategoryCommandHandler,
  CreateCategoryCommandHandler,
  DeleteCategoryCommandHandler,
  ListCategoriesQueryHandler,
  GetCategoryQueryHandler,
  ListCategoriesUnpagedQueryHandler,
  LinkAccountCommandHandler,
  CheckBankConnectionStatusCommandHandler,
  AuthoriseBankCommandHandler,
  GetOpenBankingAccountDetailsCommandHandler,
  SyncTransactionsCommandHandler,
  DisconnectBankConnectionHandler,
} from '@services';

export const accountsModule: IModule<
  IAccountsTypes & IApplicationTypes
> = async ({ bind }) => {
  bind('OpenBankingTokenManager').to(OpenBankingTokenManager);
  bind('RequestHandler').to(CheckBankConnectionStatusCommandHandler);
  bind('RequestHandler').to(AuthoriseBankCommandHandler);
  bind('RequestHandler').to(CreateAccountCommandHandler);
  bind('RequestHandler').to(DeleteAccountCommandHandler);
  bind('RequestHandler').to(UpdateAccountCommandHandler);
  bind('RequestHandler').to(CreateTransactionCommandHandler);
  bind('RequestHandler').to(UpdateTransactionCommandHandler);
  bind('RequestHandler').to(DeleteTransactionCommandHandler);
  bind('RequestHandler').to(DisconnectBankConnectionHandler);
  bind('RequestHandler').to(SyncTransactionsCommandHandler);
  bind('RequestHandler').to(GetOpenBankingAccountDetailsCommandHandler);
  bind('RequestHandler').to(UpdateCategoryCommandHandler);
  bind('RequestHandler').to(LinkAccountCommandHandler);
  bind('RequestHandler').to(CreateCategoryCommandHandler);
  bind('RequestHandler').to(DeleteCategoryCommandHandler);
  bind('RequestHandler').to(ListTransactionsQueryHandler);
  bind('RequestHandler').to(ListUserAccountsQueryHandler);
  bind('RequestHandler').to(GetAccountQueryHandler);
  bind('RequestHandler').to(ListCategoriesUnpagedQueryHandler);
  bind('RequestHandler').to(ListCategoriesQueryHandler);
  bind('RequestHandler').to(GetCategoryQueryHandler);
};
