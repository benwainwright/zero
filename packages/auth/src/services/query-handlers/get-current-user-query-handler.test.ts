import { GetCurrentUserQueryHandler } from './get-current-user-query-handler.ts';
import { buildInstance, getRequestContextBuilder } from '@zero/test-helpers';
import type { AuthQueries } from '@services';

const getMockRequestContext = getRequestContextBuilder<AuthQueries>();

describe('get current user query handler', () => {
  it('returns the current authcontext if it is a user', async () => {
    const [handler] = await buildInstance(GetCurrentUserQueryHandler);

    const context = getMockRequestContext('GetCurrentUser', undefined, 'ben');

    const result = await handler.tryHandle(context);

    expect.assertions(2);
    if (result.handled) {
      expect(result.response).toBeDefined();
      expect(result.response?.id).toEqual('ben');
    }
  });

  it('returns undefined ifd not', async () => {
    const [handler] = await buildInstance(GetCurrentUserQueryHandler);

    const context = getMockRequestContext('GetCurrentUser', undefined);

    const result = await handler.tryHandle(context);

    expect.assertions(1);
    if (result.handled) {
      expect(result.response).toBeUndefined();
    }
  });
});
