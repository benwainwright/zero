import type {
  IAccountRepository,
  IBankConnectionCreator,
  IBankConnectionRepository,
  IInstitutionAuthPageLinkFetcher,
  IOauthTokenRepository,
  IOpenBankingAccountBalanceFetcher,
  IOpenBankingAccountDetailsFetcher,
  IOpenBankingTokenFetcher,
  IOpenBankingTokenRefresher,
  IRequesitionAccountFetcher,
  ITransactionRepository,
} from '@ports';

export interface IAccountsTypes {
  OpenBankingAccountDetailsFetcher: IOpenBankingAccountDetailsFetcher;
  OauthTokenRepository: IOauthTokenRepository;
  BankConnectionRepository: IBankConnectionRepository;
  OpenBankingTokenRefresher: IOpenBankingTokenRefresher;
  BankConnectionTokenFetcher: IOpenBankingTokenFetcher;
  OpenBankingAccountBalanceFetcher: IOpenBankingAccountBalanceFetcher;
  TransactionRepository: ITransactionRepository;
  AccountRepository: IAccountRepository;
  BankConnectionCreator: IBankConnectionCreator;
  RequestionAccountFetcher: IRequesitionAccountFetcher;
  InstitutionAuthPageLinkFetcher: IInstitutionAuthPageLinkFetcher;
}
