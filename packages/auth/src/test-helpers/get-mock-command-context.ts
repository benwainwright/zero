import type { AuthCommands } from '@services';
import type { IPickCommand } from '@zero/application-core';
import { User } from '@zero/domain';

export const getMockCommandContext = <TKey extends AuthCommands['key']>(
  _key: TKey,
  params: IPickCommand<AuthCommands, TKey>['params'],
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
    command: params,
    authContext,
  };
};
