import { buildRequestHandler } from '@zero/test-helpers';
import { CheckBankConnectionStatusCommandHandler } from './check-bank-connection-status-command.ts';
import { when } from 'vitest-when';
import { OauthToken } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

describe('check bank connection status command', () => {
  it('returns an institution list if the connection status is not_connected', async () => {
    const {
      handler,
      context,
      dependencies: [bank, tokens],
    } = await buildRequestHandler(
      CheckBankConnectionStatusCommandHandler,
      'CheckBankConnectionStatusCommand',
      undefined,
      'ben'
    );

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >();

    const institutions = [
      {
        id: 'foo',
        bankName: 'barclays',
        logo: 'logo.png',
      },
      {
        id: 'foo-2',
        bankName: 'tsb',
        logo: 'tsb.png',
      },
    ];

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);
    when(bank.getInstitutionList)
      .calledWith(mockToken)
      .thenResolve(institutions);

    when(bank.getConnectionStatus)
      .calledWith(mockToken)
      .thenResolve({ status: 'not_connected' });
    const response = await handler.tryHandle(context);

    expect(response.handled).toBeTruthy();
    if (response.handled) {
      expect(response.response).toEqual({
        status: 'not_connected',
        banks: institutions,
      });
    }
  });

  it('otherwise just returns the connection status directly', async () => {
    const {
      handler,
      context,
      dependencies: [bank, tokens],
    } = await buildRequestHandler(
      CheckBankConnectionStatusCommandHandler,
      'CheckBankConnectionStatusCommand',
      undefined,
      'ben'
    );

    const createdDate = new Date();
    const refreshedDate = new Date();
    const expiredDate = new Date();

    const mockToken = mock<
      OauthToken & {
        [Symbol.asyncDispose]: () => Promise<void>;
      }
    >({ created: createdDate, refreshed: refreshedDate, expiry: expiredDate });

    when(tokens.getToken).calledWith('ben').thenResolve(mockToken);
    when(bank.getConnectionStatus)
      .calledWith(mockToken)
      .thenResolve({ status: 'connected', name: 'foo', logo: 'bar.png' });
    const response = await handler.tryHandle(context);

    expect(response.handled).toBeTruthy();

    if (response.handled) {
      expect(response.response).toEqual({
        status: 'connected',
        name: 'foo',
        logo: 'bar.png',
        created: mockToken.created,
        expires: mockToken.expiry,
        refreshed: mockToken.refreshed,
      });
    }
  });
});
