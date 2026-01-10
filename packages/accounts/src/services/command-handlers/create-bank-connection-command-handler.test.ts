import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import { CreateBankConnectionCommandHandler } from './create-bank-connection-command-handler.ts';
import type { AccountsCommands } from '@services';
import { mock } from 'vitest-mock-extended';
import type { BankConnection, OauthToken } from '@zero/domain';
import { when } from 'vitest-when';

const getContext = getCommandContextBuilder<AccountsCommands>();

describe('create bank connection command handler', () => {
  it('gets the auth link, saves the req id in the bank connection and stores it, also stores the url', async () => {
    const [instance, linkFetcher, connectionWriter, tokenManager, objectStore] =
      await buildInstance(CreateBankConnectionCommandHandler);

    const connection = mock<BankConnection>();

    const context = getContext(
      'CreateBankConnectionCommand',
      connection,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    const result = {
      requsitionId: 'req',
      url: 'url',
    };

    when(linkFetcher.getLink)
      .calledWith(connection, mockToken)
      .thenResolve(result);
    when(tokenManager.getToken).calledWith('ben').thenResolve(mockToken);

    await instance.tryHandle(context);

    expect(connection.saveRequisitionId).toHaveBeenCalledWith('req');
    expect(connectionWriter.save).toHaveBeenCalledWith(connection);
    expect(objectStore.set).toHaveBeenCalledWith(
      'bank-auth-link',
      'ben',
      'url'
    );
  });
});
