import { buildInstance, getRequestContextBuilder } from '@zero/test-helpers';
import { CreateTransactionCommandHandler } from './create-transaction-command-handler.ts';
import { Transaction } from '@zero/domain';
import type { AccountsCommands } from '../accounts-commands.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getRequestContextBuilder<AccountsCommands>();

describe('create transaction handler', () => {
  it('creates the transaction on the transaction command handler', async () => {
    const [handler, uuidGenerator, transactionRepo] = await buildInstance(
      CreateTransactionCommandHandler
    );

    const date = new Date();

    const context = getContext(
      'CreateTransactionCommand',
      {
        accountId: 'account-id',
        date,
        pending: false,
        currency: 'GBP',
        payee: 'foo',
        amount: 10,
      },
      'ben'
    );

    when(uuidGenerator.v7).calledWith().thenReturn('foo-id');

    const mocktransaction = mock<Transaction>();

    when(Transaction.create)
      .calledWith({
        id: 'foo-id',
        accountId: 'account-id',
        pending: false,
        currency: 'GBP',
        ownerId: 'ben',
        date,
        payee: 'foo',
        amount: 10,
      })
      .thenReturn(mocktransaction);

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);

    expect(transactionRepo.save).toBeCalledWith(mocktransaction);
  });
});
