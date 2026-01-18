import { buildRequestHandler } from '@zero/test-helpers';
import { SyncTransactionsCommandHandler } from './sync-transactions-command-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import { Transaction, type OauthToken } from '@zero/domain';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

describe('sync transactions command handler', () => {
  it('downloads oBanking tansactions and saves them in the repo', async () => {
    const {
      handler,
      context,
      dependencies: [bank, tokens, transactionRepo, writer],
    } = await buildRequestHandler(
      SyncTransactionsCommandHandler,
      'SyncTransactionsCommandHandler',
      { accountId: 'foo-account' },
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    const firstBookedTx = {
      transactionId: 'foo',
      debtorName: 'bar',
      transactionAmount: {
        currency: 'GBP',
        amount: '328.18',
      },
      bookingDate: '2024-12-31',
      valueDate: '2020-12-31',
    };

    const secondBookedTx = {
      transactionId: 'bar',
      creditorName: 'creditor',
      transactionAmount: {
        currency: 'GBP',
        amount: '947.26',
      },
      bookingDate: '2025-12-01',
      valueDate: undefined,
    };

    const pendingTx = {
      transactionId: 'foo-bar',
      bookingDate: '2024-01-01',
      debtorName: 'debt',
      transactionAmount: {
        currency: 'GBP',
        amount: '99.20',
      },
      valueDate: '2023-12-01',
    };

    const transactions = {
      booked: [firstBookedTx, secondBookedTx],
      pending: [pendingTx],
    };

    const first = mock<Transaction>({ id: 'foo' });
    const second = mock<Transaction>({ id: 'bar' });
    const third = mock<Transaction>({ id: 'foo-bar' });

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);

    when(transactionRepo.getMany)
      .calledWith(['foo', 'bar', 'foo-bar'])
      .thenResolve([first, second]);

    when(Transaction.createFromObTransaction)
      .calledWith(pendingTx, true, 'foo-account', 'ben')
      .thenReturn(third);

    when(bank.getAccountTransactions)
      .calledWith(mockToken, 'foo-account')
      .thenResolve(transactions);

    await handler.tryHandle(context);

    expect(first.updateFromObTransaction).toBeCalledWith(firstBookedTx, false);

    expect(second.updateFromObTransaction).toBeCalledWith(
      secondBookedTx,
      false
    );

    expect(writer.saveAll).toHaveBeenCalledWith([third]);
    expect(writer.updateAll).toHaveBeenCalledWith([first, second]);
  });
});
