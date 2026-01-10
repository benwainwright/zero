import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import { SaveRequisitionAccountsCommandHandler } from './save-requisition-accounts-command-handler.ts';
import { when } from 'vitest-when';
import type { AccountsCommands } from '@services';
import { mock } from 'vitest-mock-extended';
import { BankConnection, type OauthToken } from '@zero/domain';

const getContext = getCommandContextBuilder<AccountsCommands>();

describe('save req accounts handler', () => {
  it('requests account id, saves them, then saves the connection', async () => {
    const [handler, tokenManager, accountFetcher, connectionRepo, writer] =
      await buildInstance(SaveRequisitionAccountsCommandHandler);

    const context = getContext(
      'SaveRequisitionAccountsCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    when(tokenManager.getToken).calledWith('ben').thenResolve(mockToken);

    const connection = mock<BankConnection>();

    when(connectionRepo.require).calledWith('ben').thenResolve(connection);

    when(accountFetcher.getAccountIds)
      .calledWith(connection, mockToken)
      .thenResolve(['foo', 'bar']);

    await handler.tryHandle(context);

    expect(connection.saveAccounts).toHaveBeenCalledWith(['foo', 'bar']);

    expect(writer.save).toHaveBeenCalledWith(connection);
  });
});
