import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import { FetchOpenBankingInstitutionListCommandHandler } from './fetch-open-banking-institution-list-command-handler.ts';
import type { AccountsCommands } from '@services';
import { mock } from 'vitest-mock-extended';
import { BankConnection, OauthToken } from '@zero/domain';
import { Serialiser } from '@zero/serialiser';
import { when } from 'vitest-when';
import { INSTITUTION_LIST_STORAGE_KEY } from '@constants';

vi.mock('@zero/serialiser');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getCommandContextBuilder<AccountsCommands>();

describe('fetch open banking institution list', () => {
  it('gets the token from the fetcher and stores in object cache', async () => {
    const [handler, tokenManager, institutionListFetcher, objectStore] =
      await buildInstance(FetchOpenBankingInstitutionListCommandHandler);

    const context = getContext(
      'FetchOpenBankingInstitutionListCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    const connections = [mock<BankConnection>(), mock<BankConnection>()];
    const mockSerialiser = mock<Serialiser>();

    when(Serialiser).calledWith().thenReturn(mockSerialiser);

    when(mockSerialiser.serialise).calledWith(connections).thenReturn('foo');

    when(tokenManager.getToken).calledWith('ben').thenResolve(mockToken);
    when(institutionListFetcher.getConnections)
      .calledWith('ben', mockToken)
      .thenResolve(connections);

    const result = await handler.tryHandle(context);

    expect(result).toEqual(true);
    expect(objectStore.set).toHaveBeenCalledWith(
      INSTITUTION_LIST_STORAGE_KEY,
      'ben',
      'foo'
    );
  });
});
