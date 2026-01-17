import type { BankConnection, OauthToken } from '@zero/domain';

export interface IInstitutionListFetcher {
  getInstitutionList(token: OauthToken): Promise<BankConnection[]>;
}
