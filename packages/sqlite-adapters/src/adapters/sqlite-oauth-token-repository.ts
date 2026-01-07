import type { IOauthTokenRepository } from '@zero/accounts';
import type { OauthToken } from '@zero/domain';

export class SqliteOauthTokenRepository implements IOauthTokenRepository {
  public async getToken(
    userId: string,
    provider: string
  ): Promise<OauthToken | undefined> {
    throw new Error('Method not implemented.');
  }
  public async saveToken(token: OauthToken): Promise<OauthToken> {
    throw new Error('Method not implemented.');
  }
  public async deleteToken(token: OauthToken): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
