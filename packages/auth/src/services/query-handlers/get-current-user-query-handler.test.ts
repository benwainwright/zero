import { getMockQueryContext } from '@test-helpers';
import { GetCurrentUserQueryHandler } from './get-current-user-query-handler.ts';
import { User } from '@zero/domain';
import { mock } from 'vitest-mock-extended';
import type { ILogger } from '@zero/bootstrap';

const getHandler = () => {
  const logger = mock<ILogger>();

  const handler = new GetCurrentUserQueryHandler(logger);

  return { handler, logger };
};

describe('get current user query handler', () => {
  it('returns the current authcontext if it is a user', async () => {
    const { handler } = getHandler();
    const context = getMockQueryContext('GetCurrentUser', undefined, 'ben');

    const result = await handler.doHandle(context);

    expect(result).toBeInstanceOf(User);
    expect(result?.id).toEqual('ben');
  });

  it('returns undefined ifd not', async () => {
    const { handler } = getHandler();

    const context = getMockQueryContext('GetCurrentUser', undefined);

    const result = await handler.doHandle(context);

    expect(result).toBeUndefined();
  });
});
