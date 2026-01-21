import { buildRequestHandler } from '@zero/test-helpers';
import { SyncTransactionsCommandHandler } from './sync-transactions-command-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import { Account, Transaction, type OauthToken } from '@zero/domain';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

describe('sync transactions command handler', () => {
  it('downloads oBanking tansactions and saves them in the repo', async () => {
    const {
      handler,
      context,
      dependencies: [
        bank,
        tokens,
        accounts,
        transactionRepo,
        writer,
        stringHasher,
      ],
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
      debtorAccount: {
        iban: '1234',
      },
      transactionAmount: {
        currency: 'GBP',
        amount: '328.18',
      },
      bookingDate: '2024-12-31',
      valueDate: '2020-12-31',
    };

    when(stringHasher.md5).calledWith(`foo-bar-328.18`).thenReturn('first-id');

    const secondBookedTx = {
      transactionId: 'bar',
      creditorName: 'creditor',
      transactionAmount: {
        currency: 'GBP',
        amount: '947.26',
      },
      creditorAccount: {
        iban: '2354',
      },
      bookingDate: '2025-12-01',
      valueDate: undefined,
    };

    when(stringHasher.md5)
      .calledWith(`bar-creditor-947.26`)
      .thenReturn('second-id');

    const pendingTx = {
      transactionId: 'foo-bar',
      bookingDate: '2024-01-01',
      debtorName: 'debt',
      transactionAmount: {
        currency: 'GBP',
        amount: '99.20',
      },
      debtorAccount: {
        iban: '51243',
      },
      valueDate: '2023-12-01',
    };

    when(stringHasher.md5)
      .calledWith(`foo-bar-debt-99.20`)
      .thenReturn('third-id');

    const transactions = {
      booked: [firstBookedTx, secondBookedTx],
      pending: [pendingTx],
    };

    const account = mock<Account>({
      linkedOpenBankingAccount: 'foo-linked-account',
    });

    when(accounts.require).calledWith('foo-account').thenResolve(account);

    const first = mock<Transaction>({ id: 'first-id' });
    const second = mock<Transaction>({ id: 'second-id' });
    const third = mock<Transaction>({ id: 'third-id' });

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);

    when(transactionRepo.getMany)
      .calledWith(['first-id', 'second-id', 'third-id'])
      .thenResolve([first, second]);

    when(Transaction.createFromObTransaction)
      .calledWith(pendingTx, 'third-id', true, 'foo-account', 'ben')
      .thenReturn(third);

    when(bank.getAccountTransactions)
      .calledWith(mockToken, 'foo-linked-account')
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

  it('throws an error if the account is not linked', async () => {
    const {
      handler,
      context,
      dependencies: [, tokens, accounts],
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

    const account = mock<Account>({
      linkedOpenBankingAccount: undefined,
    });

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);

    when(accounts.require).calledWith('foo-account').thenResolve(account);

    await expect(handler.tryHandle(context)).rejects.toThrow();
  });
});
