import { buildQueryHandler, getMockQueryContext } from '@test-helpers';
import { GetCurrentUserQueryHandler } from './get-current-user-query-handler.ts';
import { User } from '@zero/domain';

describe('get current user query handler', () => {
  it('returns the current authcontext if it is a user', async () => {
    const { handler } = buildQueryHandler(GetCurrentUserQueryHandler);
    const context = getMockQueryContext('GetCurrentUser', undefined, 'ben');

    const result = await handler.tryHandle(context);

    expect.assertions(2);
    if (result.handled) {
      expect(result.response).toBeInstanceOf(User);
      expect(result.response?.id).toEqual('ben');
    }
  });

  it('returns undefined ifd not', async () => {
    const { handler } = buildQueryHandler(GetCurrentUserQueryHandler);

    const context = getMockQueryContext('GetCurrentUser', undefined);

    const result = await handler.tryHandle(context);

    expect.assertions(1);
    if (result.handled) {
      expect(result.response).toBeUndefined();
    }
  });
});
