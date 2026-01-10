import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import { GetAccountQueryHandler } from './get-account-query-handler.ts';
import type { AccountsQueries } from '../accounts-queries.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import { Account } from '@zero/domain';

const getContext = getQueryContextBuilder<AccountsQueries>();

describe('get account query handler', () => {
  it('returns the correct account', async () => {
    const [handler, accountsRepo] = await buildInstance(GetAccountQueryHandler);

    const context = getContext('GetAccountQuery', { id: 'foo' }, 'ben');

    const account = mock<Account>();

    when(accountsRepo.require).calledWith('foo').thenResolve(account);

    const result = await handler.tryHandle(context);

    expect(result).toBeTruthy();

    if (result.handled) {
      expect(result.response).toEqual(account);
    }
  });
});
