import type { AuthQueries } from '@services';
import type { IPickQuery } from '@zero/application-core';
import { User } from '@zero/domain';

export const getMockQueryContext = <TKey extends AuthQueries['query']['key']>(
  _key: TKey,
  params: IPickQuery<AuthQueries, TKey>['query']['params'],
  user?: string
) => {
  const authContext = user
    ? User.reconstitute({
        id: user,
        passwordHash: 'foo',
        email: 'bar',
        roles: [],
      })
    : undefined;

  return {
    authContext,
    query: params,
  };
};
