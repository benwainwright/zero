import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import { ListUserAccountsQueryHandler } from './list-user-accounts-query-handler.ts';
import type { AccountsQueries } from '../accounts-queries.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import { Account } from '@zero/domain';

const getContext = getQueryContextBuilder<AccountsQueries>();

describe('list accounts query handler', () => {
  it('returns the accounts provided by the repo', async () => {
    const [handler, accountsRepo] = await buildInstance(
      ListUserAccountsQueryHandler
    );

    const context = getContext(
      'ListUserAccountsQuery',
      { offset: 0, limit: 30 },
      'ben'
    );

    const accounts = [mock<Account>(), mock<Account>()];

    when(accountsRepo.list)
      .calledWith({ start: 0, limit: 30, userId: 'ben' })
      .thenResolve(accounts);

    const result = await handler.tryHandle(context);

    expect(result).toBeTruthy();

    if (result.handled) {
      expect(result.response).toEqual(accounts);
    }
  });
});
