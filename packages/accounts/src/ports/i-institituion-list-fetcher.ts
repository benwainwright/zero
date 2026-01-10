import type { BankConnection, OauthToken } from '@zero/domain';

export interface IInstitutionListFetcher {
  getConnections(userId: string, token: OauthToken): Promise<BankConnection[]>;
}
