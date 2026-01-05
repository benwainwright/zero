import type { BankConnection, OauthToken } from '@zero/domain';

export interface IRequisitionAccountsFetcher {
  getAccountIds(
    bankConnection: BankConnection,
    token: OauthToken
  ): Promise<string[]>;
}
