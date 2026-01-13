import { buildCommandHandler } from '@zero/test-helpers';
import { FetchLinkedAccountDetailsCommandHandler } from './fetch-linked-accounts-details-handler.ts';
import { when } from 'vitest-when';
import { BankConnection, OauthToken } from '@zero/domain';
import { mock } from 'vitest-mock-extended';
import { ACCOUNT_DETAILS_KEY } from '@constants';

describe('fetch linked account options', () => {
  it('fetches the accounts from gocardless and saves in the bank connection if there is no accounts', async () => {
    const {
      handler,
      context,
      dependencies: [
        tokenManager,
        accountIdsFetcher,
        connectionReader,
        connectionWriter,
      ],
    } = await buildCommandHandler(
      FetchLinkedAccountDetailsCommandHandler,
      'FetchLinkedAccountsDetailsCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    const mockConnection = mock<BankConnection>({ accounts: undefined });

    when(tokenManager.getToken).calledWith('ben').thenResolve(mockToken);
    when(connectionReader.require)
      .calledWith('ben')
      .thenResolve(mockConnection);

    when(accountIdsFetcher.getAccountIds)
      .calledWith(mockConnection, mockToken)
      .thenResolve(['foo', 'bar']);

    await handler.tryHandle(context);

    expect(mockConnection.saveAccounts).toHaveBeenCalledWith(['foo', 'bar']);

    expect(connectionWriter.update).toHaveBeenCalledWith(mockConnection);
  });

  it('doesnt bother fetching account ids if accounts exist', async () => {
    const {
      handler,
      context,
      dependencies: [tokenManager, accountIdsFetcher, connectionReader],
    } = await buildCommandHandler(
      FetchLinkedAccountDetailsCommandHandler,
      'FetchLinkedAccountsDetailsCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    const mockConnection = mock<BankConnection>({ accounts: ['foo'] });

    when(tokenManager.getToken).calledWith('ben').thenResolve(mockToken);
    when(connectionReader.require)
      .calledWith('ben')
      .thenResolve(mockConnection);

    when(accountIdsFetcher.getAccountIds)
      .calledWith(mockConnection, mockToken)
      .thenResolve(['foo', 'bar']);

    await handler.tryHandle(context);

    expect(accountIdsFetcher.getAccountIds).not.toHaveBeenCalled();
    expect(mockConnection.saveAccounts).toHaveBeenCalled();
  });

  it('gets the account details from the bank and saves them in object storage', async () => {
    const {
      handler,
      context,
      dependencies: [
        tokenManager,
        ,
        connectionReader,
        ,
        storage,
        accountDetailsFetcher,
      ],
    } = await buildCommandHandler(
      FetchLinkedAccountDetailsCommandHandler,
      'FetchLinkedAccountsDetailsCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    const details = [
      { id: 'foo', name: 'bar', details: 'baz' },
      { id: 'baz', name: 'bip', details: 'bong' },
    ];

    const mockConnection = mock<BankConnection>({ accounts: ['foo', 'bar'] });

    when(tokenManager.getToken).calledWith('ben').thenResolve(mockToken);
    when(connectionReader.require)
      .calledWith('ben')
      .thenResolve(mockConnection);

    when(accountDetailsFetcher.getAccountDetails)
      .calledWith(['foo', 'bar'], mockToken)
      .thenResolve(details);

    await handler.tryHandle(context);

    expect(storage.set).toHaveBeenCalledWith(
      ACCOUNT_DETAILS_KEY,
      'ben',
      JSON.stringify(details)
    );
  });
});
