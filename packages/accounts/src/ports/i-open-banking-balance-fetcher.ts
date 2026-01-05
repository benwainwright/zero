import type { OauthToken } from '@zero/domain';

export interface IOpenBankingAccountBalanceFetcher {
  getAccountBalance(id: string, token: OauthToken): Promise<number>;
}
