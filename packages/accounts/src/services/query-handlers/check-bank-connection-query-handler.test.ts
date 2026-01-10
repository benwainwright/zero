import { when } from 'vitest-when';
import { CheckBankConnectionQueryHandler } from './check-bank-connection-query-handler.ts';
import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import type { AccountsQueries } from '@services';
import { BankConnection, OauthToken } from '@zero/domain';
import { mock } from 'vitest-mock-extended';
const getContext = getQueryContextBuilder<AccountsQueries>();

describe('check bank connection', () => {
  it('checks to see if there is a bank connection in the database and returns either connected or not connected', async () => {
    const [handler, bankConnectionRepo, tokenRepo] = await buildInstance(
      CheckBankConnectionQueryHandler
    );

    const context = getContext('CheckBankConnectionQuery', undefined, 'ben');

    const connected = new Date();
    const refreshed = new Date();
    const expiry = new Date();

    const mockToken = mock<OauthToken>({
      refreshed,
      created: connected,
      expiry,
    });

    when(tokenRepo.get)
      .calledWith('ben', 'open-banking')
      .thenResolve(mockToken);

    const mockConnection = mock<BankConnection>({
      logo: 'logo',
      bankName: 'bank',
    });

    when(bankConnectionRepo.get).calledWith('ben').thenResolve(mockConnection);

    const result = await handler.tryHandle(context);

    expect(result.handled);
    if (result.handled) {
      expect(result.response).toEqual({
        status: 'connected',
        logo: 'logo',
        bankName: 'bank',
        connected: mockToken.created,
        refreshed: mockToken.refreshed,
        expires: mockToken.expiry,
      });
    }
  });
});
