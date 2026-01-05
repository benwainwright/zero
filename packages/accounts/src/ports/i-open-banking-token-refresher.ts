import type { OauthToken } from '@zero/domain';

export interface IOpenBankingTokenRefresher {
  refreshToken(token: OauthToken): Promise<{
    token: string;
    tokenExpiresIn: number;
  }>;
}
