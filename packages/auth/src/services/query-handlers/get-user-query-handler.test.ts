import { buildQueryHandler, getMockQueryContext } from '@test-helpers';
import { GetUserQueryHandler } from './get-user-query-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import type { User } from '@zero/domain';
describe('get user query handler', () => {
  it('gets the user from the repo and returns it', async () => {
    const { handler, userRepo } = buildQueryHandler(GetUserQueryHandler);

    const mockBen = mock<User>();

    when(userRepo.require).calledWith('ben').thenResolve(mockBen);

    const context = getMockQueryContext('GetUser', { username: 'ben' }, 'ben');

    const result = await handler.tryHandle(context);

    expect.assertions(1);

    if (result.handled) {
      expect(result.response).toEqual(mockBen);
    }
  });
});
