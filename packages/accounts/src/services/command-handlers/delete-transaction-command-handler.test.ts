import { when } from 'vitest-when';
import { DeleteTransactionCommandHandler } from './delete-transaction-command-handler.ts';
import { buildInstance, getRequestContextBuilder } from '@zero/test-helpers';
import type { AccountsCommands } from '../accounts-commands.ts';
import { mock } from 'vitest-mock-extended';
import type { Transaction } from '@zero/domain';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getRequestContextBuilder<AccountsCommands>();

describe('delete tx handler', () => {
  it('calls delete on the tx if it exists and then saves it back in the repo', async () => {
    const [handler, txes, writer] = await buildInstance(
      DeleteTransactionCommandHandler
    );

    const context = getContext(
      'DeleteTransactionCommand',
      { transaction: 'foo-bar' },
      'ben'
    );
    const mockTx = mock<Transaction>();
    when(txes.require).calledWith('foo-bar').thenResolve(mockTx);

    const result = await handler.tryHandle(context);

    expect(result).toEqual(true);

    expect(mockTx.delete).toHaveBeenCalled();
    expect(writer.delete).toHaveBeenCalledWith(mockTx);
  });
});
