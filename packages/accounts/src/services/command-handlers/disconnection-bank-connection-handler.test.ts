import { buildRequestHandler } from '@zero/test-helpers';
import { DisconnectBankConnectionHandler } from './disconnect-bank-connection-handler.ts';
import { when } from 'vitest-when';
import type { OauthToken } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

describe('delete bank connection', () => {
  it('calls the deleteConnection method on the openBanking client', async () => {
    const {
      handler,
      context,
      dependencies: [bank, tokens],
    } = await buildRequestHandler(
      DisconnectBankConnectionHandler,
      'DisconnectBankConnectionCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);

    await handler.tryHandle(context);

    expect(bank.disconnect).toHaveBeenCalledWith(mockToken);
  });
});
