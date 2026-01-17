import { buildRequestHandler } from '@zero/test-helpers';
import { GetOpenBankingAccountDetailsCommandHandler } from './get-open-banking-account-details-command-handler.ts';
import { when } from 'vitest-when';
import type { OauthToken } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

describe('get open banking account details command handler', () => {
  it('gets the accounts from the obanking client and returns them', async () => {
    const {
      handler,
      context,
      dependencies: [oBankingClient, tokens],
    } = await buildRequestHandler(
      GetOpenBankingAccountDetailsCommandHandler,
      'GetOpenBankingAccountsCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);

    const institutions = [
      {
        id: 'foo',
        name: 'bar',
        details: 'baz',
      },
      {
        id: 'bip',
        name: 'bar',
        details: 'baz',
      },
    ];

    when(oBankingClient.getAccounts)
      .calledWith(mockToken)
      .thenResolve(institutions);

    const response = await handler.tryHandle(context);
    expect(response.handled).toEqual(true);
    if (response.handled) {
      expect(response.response).toEqual(institutions);
    }
  });
});
