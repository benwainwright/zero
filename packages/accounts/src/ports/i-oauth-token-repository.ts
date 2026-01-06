import type { OauthToken } from '@zero/domain';

export interface IOauthTokenRepository {
  getToken(userId: string, provider: string): Promise<OauthToken | undefined>;
  saveToken(token: OauthToken): Promise<OauthToken>;
  deleteToken(token: OauthToken): Promise<void>;
}
