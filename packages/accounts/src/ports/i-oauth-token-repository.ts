import type { IReadRepository } from '@zero/application-core';
import type { OauthToken } from '@zero/domain';

export type IOauthTokenRepository = IReadRepository<
  OauthToken,
  [userId: string, provider: string]
>;
