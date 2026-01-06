import type {
  IAccountRepository,
  IBankConnectionCreator,
  IInstitutionAuthPageLinkFetcher,
  IOauthTokenRepository,
  IOpenBankingAccountBalanceFetcher,
  IOpenBankingAccountDetailsFetcher,
  IOpenBankingTokenFetcher,
  IOpenBankingTokenRefresher,
  IRequesitionAccountFetcher,
} from '@ports';

export interface IAccountsTypes {
  OpenBankingAccountDetailsFetcher: IOpenBankingAccountDetailsFetcher;
  OauthTokenRepository: IOauthTokenRepository;
  OpenBankingTokenRefresher: IOpenBankingTokenRefresher;
  BankConnectionTokenFetcher: IOpenBankingTokenFetcher;
  OpenBankingAccountBalanceFetcher: IOpenBankingAccountBalanceFetcher;
  AccountRepository: IAccountRepository;
  BankConnectionCreator: IBankConnectionCreator;
  RequestionAccountFetcher: IRequesitionAccountFetcher;
  InstitutionAuthPageLinkFetcher: IInstitutionAuthPageLinkFetcher;
}
