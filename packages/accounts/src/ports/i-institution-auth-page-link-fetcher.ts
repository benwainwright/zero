import type { BankConnection, OauthToken } from '@zero/domain';

export interface IInstitutionAuthPageLinkFetcher {
  getLink(
    connection: BankConnection,
    token: OauthToken
  ): Promise<{ requsitionId: string; url: string }>;
}
