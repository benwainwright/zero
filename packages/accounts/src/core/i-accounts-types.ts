import type { AccountsEvents } from '@core';
import type {
  IAccountRepository,
  IInstitutionListFetcher,
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
import type { OpenBankingTokenManager } from '@services';
import type {
  IAllEvents,
  IEventBus,
  IWriteRepository,
} from '@zero/application-core';
import type {
  Account,
  BankConnection,
  OauthToken,
  Transaction,
} from '@zero/domain';

export interface IAccountsTypes {
  EventBus: IEventBus<IAllEvents & AccountsEvents>;
  OpenBankingAccountDetailsFetcher: IOpenBankingAccountDetailsFetcher;
  OpenBankingTokenManager: OpenBankingTokenManager;
  OauthTokenRepository: IOauthTokenRepository;
  OauthTokenWriter: IWriteRepository<OauthToken>;
  BankConnectionRepository: IBankConnectionRepository;
  BankConnectionWriter: IWriteRepository<BankConnection>;
  OpenBankingTokenRefresher: IOpenBankingTokenRefresher;
  BankConnectionTokenFetcher: IOpenBankingTokenFetcher;
  OpenBankingAccountBalanceFetcher: IOpenBankingAccountBalanceFetcher;
  TransactionRepository: ITransactionRepository;
  TransactionWriter: IWriteRepository<Transaction>;
  AccountRepository: IAccountRepository;
  AccountWriter: IWriteRepository<Account>;
  InstitutionListFetcher: IInstitutionListFetcher;
  RequestionAccountFetcher: IRequesitionAccountFetcher;
  InstitutionAuthPageLinkFetcher: IInstitutionAuthPageLinkFetcher;
}
