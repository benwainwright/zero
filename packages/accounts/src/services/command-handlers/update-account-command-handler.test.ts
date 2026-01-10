import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import { UpdateAccountCommandHandler } from './update-account-command-handler.ts';
import type { AccountsCommands } from '../accounts-commands.ts';
import type { Account } from '@zero/domain';
import { mock } from 'vitest-mock-extended';
import { when } from 'vitest-when';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getCommandContextBuilder<AccountsCommands>();

describe('update account command handler', () => {
  it('updates the account and saves it back in the repo', async () => {
    const [handler, accounts, writer] = await buildInstance(
      UpdateAccountCommandHandler
    );

    const context = getContext(
      'UpdateAccountCommand',
      { id: 'foo-bar', name: 'foo', description: 'bar' },
      'ben'
    );
    const mockAccount = mock<Account>();

    when(accounts.require).calledWith('foo-bar').thenResolve(mockAccount);

    const result = await handler.tryHandle(context);
    expect(result).toEqual(true);

    expect(mockAccount.update).toHaveBeenCalledWith({
      description: 'bar',
      name: 'foo',
    });

    expect(writer.save).toHaveBeenCalledWith(mockAccount);
  });
});
