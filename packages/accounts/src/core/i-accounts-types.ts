import type {
  IBankConnectionCreator,
  IInstitutionAuthPageLinkFetcher,
  IOpenBankingAccountBalanceFetcher,
  IOpenBankingAccountDetailsFetcher,
  IOpenBankingTokenFetcher,
  IOpenBankingTokenRefresher,
  IRequesitionAccountFetcher,
} from '@ports';

export interface IAccountsTypes {
  OpenBankingAccountDetailsFetcher: IOpenBankingAccountDetailsFetcher;
  OpenBankingTokenRefresher: IOpenBankingTokenRefresher;
  BankConnectionTokenFetcher: IOpenBankingTokenFetcher;
  OpenBankingAccountBalanceFetcher: IOpenBankingAccountBalanceFetcher;
  BankConnectionCreator: IBankConnectionCreator;
  RequestionAccountFetcher: IRequesitionAccountFetcher;
  InstitutionAuthPageLinkFetcher: IInstitutionAuthPageLinkFetcher;
}
