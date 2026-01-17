import { buildInstance, getRequestContextBuilder } from '@zero/test-helpers';
import { UpdateTransactionCommandHandler } from './update-transaction-command-handler.ts';
import type { AccountsCommands } from '../accounts-commands.ts';
import type { Transaction } from '@zero/domain';
import { mock } from 'vitest-mock-extended';
import { when } from 'vitest-when';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getRequestContextBuilder<AccountsCommands>();

describe('update tx command handler', () => {
  it('updates the tx and saves it back in the repo', async () => {
    const [handler, txes, writer] = await buildInstance(
      UpdateTransactionCommandHandler
    );

    const date = new Date();

    const context = getContext(
      'UpdateTransactionCommand',
      { id: 'foo-bar', date, payee: 'foo' },
      'ben'
    );
    const mockTransaction = mock<Transaction>();

    when(txes.require).calledWith('foo-bar').thenResolve(mockTransaction);

    const result = await handler.tryHandle(context);
    expect(result).toEqual(true);

    expect(mockTransaction.update).toHaveBeenCalledWith({
      payee: 'foo',
      date,
    });

    expect(writer.update).toHaveBeenCalledWith(mockTransaction);
  });
});
