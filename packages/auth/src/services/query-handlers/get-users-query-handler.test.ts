import { GetUsersQueryHandler } from './get-users-query-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import type { User } from '@zero/domain';
import { buildInstance, getRequestContextBuilder } from '@zero/test-helpers';
import type { AuthQueries } from '@services';

const getMockRequestContext = getRequestContextBuilder<AuthQueries>();

describe('get users query handler', () => {
  it('gets the users from the repo', async () => {
    const [handler, userRepo] = await buildInstance(GetUsersQueryHandler);

    const context = getMockRequestContext(
      'GetUsers',
      { offset: 0, limit: 30 },
      'ben'
    );

    const users = [mock<User>(), mock<User>()];
    when(userRepo.list).calledWith({ start: 0, limit: 30 }).thenResolve(users);

    const result = await handler.tryHandle(context);

    expect.assertions(1);
    if (result.handled) {
      expect(result.response).toEqual(users);
    }
  });
});
