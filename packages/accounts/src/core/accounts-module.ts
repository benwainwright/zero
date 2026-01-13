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
  CheckBankConnectionQueryHandler,
  CreateBankConnectionCommandHandler,
  FetchOpenBankingInstitutionListCommandHandler,
  GetBankAuthLinkQueryHandler,
  GetOpenBankingInstitutionListQueryHandler,
  DeleteAuthLinkCommandHandler,
  OpenBankingTokenManager,
  UpdateCategoryCommandHandler,
  CreateCategoryCommandHandler,
  DeleteCategoryCommandHandler,
  ListCategoriesQueryHandler,
  GetCategoryQueryHandler,
  ListCategoriesUnpagedQueryHandler,
  SaveRequisitionAccountsCommandHandler,
  FetchLinkedAccountDetailsCommandHandler,
  GetLinkedAccountsDetailsQuery,
  LinkAccountCommandHandler,
} from '@services';

export const accountsModule: IModule<
  IAccountsTypes & IApplicationTypes
> = async ({ bind }) => {
  bind('OpenBankingTokenManager').to(OpenBankingTokenManager);
  bind('CommandHandler').to(CreateAccountCommandHandler);
  bind('CommandHandler').to(DeleteAccountCommandHandler);
  bind('CommandHandler').to(UpdateAccountCommandHandler);
  bind('CommandHandler').to(CreateTransactionCommandHandler);
  bind('CommandHandler').to(UpdateTransactionCommandHandler);
  bind('CommandHandler').to(DeleteTransactionCommandHandler);
  bind('CommandHandler').to(CreateBankConnectionCommandHandler);
  bind('CommandHandler').to(FetchOpenBankingInstitutionListCommandHandler);
  bind('CommandHandler').to(DeleteAuthLinkCommandHandler);
  bind('CommandHandler').to(UpdateCategoryCommandHandler);
  bind('CommandHandler').to(LinkAccountCommandHandler);
  bind('CommandHandler').to(CreateCategoryCommandHandler);
  bind('CommandHandler').to(DeleteCategoryCommandHandler);
  bind('CommandHandler').to(SaveRequisitionAccountsCommandHandler);
  bind('CommandHandler').to(FetchLinkedAccountDetailsCommandHandler);
  bind('QueryHandler').to(GetLinkedAccountsDetailsQuery);
  bind('QueryHandler').to(ListTransactionsQueryHandler);
  bind('QueryHandler').to(ListUserAccountsQueryHandler);
  bind('QueryHandler').to(GetAccountQueryHandler);
  bind('QueryHandler').to(CheckBankConnectionQueryHandler);
  bind('QueryHandler').to(GetBankAuthLinkQueryHandler);
  bind('QueryHandler').to(ListCategoriesUnpagedQueryHandler);
  bind('QueryHandler').to(GetOpenBankingInstitutionListQueryHandler);
  bind('QueryHandler').to(ListCategoriesQueryHandler);
  bind('QueryHandler').to(GetCategoryQueryHandler);
};
