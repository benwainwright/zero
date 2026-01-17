import { buildRequestHandler } from '@zero/test-helpers';
import { AuthoriseBankCommandHandler } from './authorise-bank-command-handler.ts';
import { when } from 'vitest-when';
import type { OauthToken } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

describe('auth bank command handler', () => {
  it('fetches the auth link from the open banking client and returns it', async () => {
    const {
      handler,
      context,
      dependencies: [bank, tokens],
    } = await buildRequestHandler(
      AuthoriseBankCommandHandler,
      'AuthoriseBankCommand',
      {
        bankId: 'foo-bank',
      },
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);
    when(bank.getAuthorisationUrl)
      .calledWith(mockToken, 'foo-bank')
      .thenResolve('the-url');

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response.authUrl).toEqual('the-url');
    }
  });
});
