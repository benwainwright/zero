import type { AuthQueries } from '@services';
import type {
  IQueryParamsOrUndefined,
  IPickQuery,
} from '@zero/application-core';
import { User } from '@zero/domain';

export const getMockQueryContext = <TKey extends AuthQueries['key']>(
  key: TKey,
  params: IQueryParamsOrUndefined<IPickQuery<AuthQueries, TKey>>,
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
    query: { id: 'foo-bar', key: key, params },
  };
};
