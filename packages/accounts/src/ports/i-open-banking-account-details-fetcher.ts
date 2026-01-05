import type { OauthToken } from '@zero/domain';

export interface IOpenBankingAccountDetailsFetcher {
  getAccountDetails(
    ids: string[],
    token: OauthToken
  ): Promise<
    {
      id: string;
      name: string | undefined;
      details: string | undefined;
    }[]
  >;
}
