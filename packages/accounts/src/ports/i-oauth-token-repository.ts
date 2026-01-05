import type { OauthToken } from '@zero/domain';

export interface IOauthTokenRepository {
  get(userId: string, provider: string): Promise<OauthToken | undefined>;
  save(token: OauthToken): Promise<OauthToken>;
  delete(token: OauthToken): Promise<void>;
}
