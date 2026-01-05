import type { BankConnection, OauthToken } from '@zero/domain';

export interface IBankConnectionCreator {
  getConnections(userId: string, token: OauthToken): Promise<BankConnection[]>;
}
