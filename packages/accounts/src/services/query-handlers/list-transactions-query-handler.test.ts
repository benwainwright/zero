import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import { ListTransactionsQueryHandler } from './list-transactions-query-handler.ts';
import type { AccountsQueries } from '@services';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import type { Transaction } from '@zero/domain';

const getContext = getQueryContextBuilder<AccountsQueries>();

describe('list transactions query handler', () => {
  it('returns the txs from the repo', async () => {
    const [instance, repo] = await buildInstance(ListTransactionsQueryHandler);

    const context = getContext(
      'ListTransactionsQuery',
      {
        accountId: 'foo',
        offset: 0,
        limit: 30,
      },
      'ben'
    );

    const txes = [mock<Transaction>(), mock<Transaction>()];

    when(repo.list)
      .calledWith({
        start: 0,
        limit: 30,
        userId: 'ben',
        accountId: 'foo',
      })
      .thenResolve(txes);

    when(repo.count)
      .calledWith({
        userId: 'ben',
        accountId: 'foo',
      })
      .thenResolve(2);

    const result = await instance.tryHandle(context);
    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response).toEqual({ transactions: txes, total: 2 });
    }
  });
});
