import { buildInstance, getRequestContextBuilder } from '@zero/test-helpers';
import { CreateAccountCommandHandler } from './create-account-command-handler.ts';
import { Account } from '@zero/domain';
import type { AccountsCommands } from '../accounts-commands.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getRequestContextBuilder<AccountsCommands>();

describe('create account handler', () => {
  it('creates the account on the account command handler', async () => {
    const [handler, uuidGenerator, accountRepo] = await buildInstance(
      CreateAccountCommandHandler
    );

    const context = getContext(
      'CreateAccountCommand',
      {
        name: 'foo',
        description: 'blob',
      },
      'ben'
    );

    when(uuidGenerator.v7).calledWith().thenReturn('foo-id');

    const mockAccount = mock<Account>();

    when(Account.create)
      .calledWith({
        id: 'foo-id',
        ownerId: 'ben',
        name: 'foo',
        description: 'blob',
      })
      .thenReturn(mockAccount);

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);

    if (result.handled) {
      expect(accountRepo.save).toBeCalledWith(mockAccount);
    }
  });
});
