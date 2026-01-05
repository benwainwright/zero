import type { OauthToken } from './oauth-token.ts';

export interface IOauthTokenEvents {
  OauthTokenCreated: OauthToken;
  OauthTokenDeleted: OauthToken;
  OauthTokenUsed: OauthToken;
  OauthTokenRefreshed: { old: OauthToken; new: OauthToken };
}
