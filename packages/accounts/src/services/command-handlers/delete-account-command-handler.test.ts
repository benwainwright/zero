import { when } from 'vitest-when';
import { DeleteAccountCommandHandler } from './delete-account-command-handler.ts';
import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import type { AccountsCommands } from '../accounts-commands.ts';
import { mock } from 'vitest-mock-extended';
import type { Account } from '@zero/domain';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getCommandContextBuilder<AccountsCommands>();

describe('delete account handler', () => {
  it('calls delete on the account if it exists and then saves it back in the repo', async () => {
    const [handler, accounts] = await buildInstance(
      DeleteAccountCommandHandler
    );

    const context = getContext(
      'DeleteAccountCommand',
      { account: 'foo-bar' },
      'ben'
    );
    const mockAccount = mock<Account>();
    when(accounts.getAccount).calledWith('foo-bar').thenResolve(mockAccount);
    const result = await handler.tryHandle(context);
    expect(result).toEqual(true);
    expect(mockAccount.deleteAccount).toHaveBeenCalled();
    expect(accounts.saveAccount).toHaveBeenCalledWith(mockAccount);
  });
});
