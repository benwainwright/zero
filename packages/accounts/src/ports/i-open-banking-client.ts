import type { IOpenBankingTransaction, OauthToken } from '@zero/domain';

export interface IPossbileInstitution {
  bankName: string;
  id: string;
  logo: string;
}

export type OpenBankingConnectionStatus =
  | {
      status: 'not_connected';
    }
  | {
      status: 'connected';
      name: string;
      logo: string;
    }
  | {
      status: 'authorizing';
    }
  | {
      status: 'rejected';
    }
  | {
      status: 'expired';
    };

export interface IOpenBankingAccountDetails {
  id: string;
  name: string | undefined;
  details: string | undefined;
}

export interface IOpenBankingClient {
  getConnectionStatus(token: OauthToken): Promise<OpenBankingConnectionStatus>;
  getInstitutionList(token: OauthToken): Promise<IPossbileInstitution[]>;
  getAuthorisationUrl(token: OauthToken, bankId: string): Promise<string>;
  getAccounts(token: OauthToken): Promise<IOpenBankingAccountDetails[]>;
  getAccountTransactions(
    token: OauthToken,
    accountId: string
  ): Promise<{
    booked: IOpenBankingTransaction[];
    pending: IOpenBankingTransaction[];
  }>;
}
