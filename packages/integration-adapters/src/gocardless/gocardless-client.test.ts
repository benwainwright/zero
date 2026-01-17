import { server, GOCARDLESS_API } from '@test-helpers';
export { REQUISITION_ID_KEY } from './constants.ts';
import { GocardlessClient } from './gocardless-client.ts';
import { mockGocardlessData } from '../test-helpers/msw/index.ts';
import { mock } from 'vitest-mock-extended';
import { OauthToken } from '@zero/domain';
import { http, HttpResponse } from 'msw';
import { when } from 'vitest-when';
import type { IObjectStorage } from '@zero/application-core';
import { REQUISITION_ID_KEY } from './constants.ts';

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  server.resetHandlers();
  vi.useRealTimers();
  vi.setSystemTime(vi.getRealSystemTime());
});

describe('the gocardless client', () => {
  describe('getConnectionStatus', () => {
    it('returns not connected if there is no requisition associated with the token', async () => {
      const objectStore = mock<IObjectStorage>();

      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        objectStore,
        mock(),
        mock()
      );

      const newToken = OauthToken.reconstitute({
        refreshExpiry: undefined,
        provider: 'ynab',
        id: 'foo',
        token: mockGocardlessData.mockToken,
        refreshToken: 'string',
        expiry: new Date(),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'user',
      });

      when(objectStore.get)
        .calledWith(REQUISITION_ID_KEY, 'foo')
        .thenResolve(undefined);

      const result = await client.getConnectionStatus(newToken);

      expect(result).toEqual({ status: 'not_connected' });
    });

    it('gets the details of the institution if there is a connection', async () => {
      const objectStore = mock<IObjectStorage>();

      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        objectStore,
        mock(),
        mock()
      );

      const newToken = OauthToken.reconstitute({
        refreshExpiry: undefined,
        provider: 'ynab',
        id: 'foo',
        token: mockGocardlessData.mockToken,
        refreshToken: 'string',
        expiry: new Date(),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'user',
      });

      when(objectStore.get)
        .calledWith(REQUISITION_ID_KEY, 'foo')
        .thenResolve(mockGocardlessData.mockConnectedRequisitionResponse.id);

      const result = await client.getConnectionStatus(newToken);

      expect(result).toEqual({
        status: 'connected',
        logo: mockGocardlessData.mockInstututionResponse.logo,
        bankname: mockGocardlessData.mockInstututionResponse.name,
      });
    });
  });

  describe('get account transactions', () => {
    it('it returns the account transactions from the response', async () => {
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        mock(),
        mock(),
        mock()
      );

      const newToken = OauthToken.reconstitute({
        refreshExpiry: undefined,
        provider: 'ynab',
        id: 'foo',
        token: mockGocardlessData.mockToken,
        refreshToken: 'string',
        expiry: new Date(Date.now() + 10_000),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'user',
      });

      const txes = await client.getAccountTransactions(
        newToken,
        mockGocardlessData.mockAccountId
      );

      expect(txes).toEqual(mockGocardlessData.mockTransactions.transactions);
    });
  });

  describe('getAccountBalance', () => {
    it('returns the value of the most recent balance entry', async () => {
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        mock(),
        mock(),
        mock()
      );
      const newToken = OauthToken.reconstitute({
        refreshExpiry: undefined,
        provider: 'ynab',
        id: 'foo',
        token: mockGocardlessData.mockToken,
        refreshToken: 'string',
        expiry: new Date(),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'user',
      });

      const result = await client.getAccountBalance(
        mockGocardlessData.mockAccountId,
        newToken
      );

      expect(typeof result).toEqual('number');
      expect(result).toEqual(65749);
    });
  });

  describe('getAccounts', () => {
    it.only('gets the details of the requisition accounts', async () => {
      const storage = mock<IObjectStorage>();

      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        storage,
        mock(),
        mock()
      );

      const token = OauthToken.reconstitute({
        id: 'foo',
        refreshExpiry: undefined,
        provider: 'gocardless',
        token: mockGocardlessData.mockToken,
        refreshToken: 'string',
        expiry: new Date(Date.now() + 10_000_000),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'user',
      });

      when(storage.get)
        .calledWith(REQUISITION_ID_KEY, token.id)
        .thenResolve(mockGocardlessData.mockConnectedRequisitionResponse.id);

      const result = await client.getAccounts(token);
      expect(result).toEqual([
        { id: 'foo', name: 'the name', details: undefined },
        { id: 'bar', name: 'the name', details: 'foo-details' },
      ]);
    });
  });

  it('handles account not ready responses by polling /details until the account is ready', async () => {
    let ready = false;
    server.use(
      http.get(`${GOCARDLESS_API}/api/v2/accounts/foo/`, () => {
        try {
          if (ready === false) {
            return HttpResponse.json({
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              created: '2026-01-15T08:08:04.065Z',
              last_accessed: '2026-01-15T08:08:04.065Z',
              iban: 'string',
              bban: 'string',
              status: 'PROCESSING',
              institution_id: 'string',
              owner_name: 'string',
              name: 'string',
            });
          } else {
            return HttpResponse.json({
              id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
              created: '2026-01-15T08:08:04.065Z',
              last_accessed: '2026-01-15T08:08:04.065Z',
              iban: 'string',
              bban: 'string',
              status: 'READY',
              institution_id: 'string',
              owner_name: 'string',
              name: 'string',
            });
          }
        } finally {
          ready = true;
        }
      }),
      http.get(`${GOCARDLESS_API}/api/v2/accounts/foo/details/`, () => {
        if (!ready) {
          return HttpResponse.json(
            {
              summary: 'Account is Processing',
              detail:
                'Your account data is currently being processed. Please try again shortly, or poll /accounts/d9d827ab-cf91-47ba-8e8f-35bef1024f9f/ endpoint and retry when status is READY',
              status_code: 409,
              type: 'AccountProcessing',
            },
            { status: 409 }
          );
        }

        return HttpResponse.json(
          mockGocardlessData.mockAccountDetailsResponses.foo
        );
      })
    );

    const storage = mock<IObjectStorage>();

    const client = new GocardlessClient(
      { value: Promise.resolve(mockGocardlessData.secretId) },
      { value: Promise.resolve(mockGocardlessData.secretKey) },
      { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
      mock(),
      mock(),
      mock(),
      storage,
      mock(),
      mock()
    );

    const token = OauthToken.reconstitute({
      id: 'foo',
      refreshExpiry: undefined,
      provider: 'gocardless',
      token: mockGocardlessData.mockToken,
      refreshToken: 'string',
      expiry: new Date(Date.now() + 10_000),
      lastUse: undefined,
      created: new Date(),
      refreshed: undefined,
      ownerId: 'user',
    });

    when(storage.get)
      .calledWith(REQUISITION_ID_KEY, token.id)
      .thenResolve(mockGocardlessData.mockConnectedRequisitionResponse.id);

    const resultPromise = client.getAccounts(token);
    await vi.advanceTimersByTimeAsync(5000);
    expect(await resultPromise).toEqual([
      { id: 'foo', name: 'the name', details: undefined },
      { id: 'bar', name: 'the name', details: 'foo-details' },
    ]);
  });

  it('returns the authorisation link for a bank and saves the req id in object storage', async () => {
    const storage = mock<IObjectStorage>();
    const client = new GocardlessClient(
      { value: Promise.resolve(mockGocardlessData.secretId) },
      { value: Promise.resolve(mockGocardlessData.secretKey) },
      { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
      mock(),
      mock(),
      mock(),
      storage,
      mock(),
      mock()
    );

    const token = OauthToken.reconstitute({
      id: 'foo',
      refreshExpiry: undefined,
      provider: 'ynab',
      token: mockGocardlessData.mockToken,
      refreshToken: 'string',
      expiry: new Date(),
      lastUse: undefined,
      created: new Date(),
      refreshed: undefined,
      ownerId: 'user',
    });

    const result = await client.getAuthorisationUrl(
      token,
      mockGocardlessData.mockRequisitionResponse.institution_id
    );

    expect(result).toEqual(mockGocardlessData.mockRequisitionResponse.link);

    expect(storage.set).toHaveBeenCalledWith(
      REQUISITION_ID_KEY,
      token.id,
      mockGocardlessData.mockRequisitionResponse.id
    );
  });

  describe('getNewToken', () => {
    it('returns the correct token', async () => {
      const today = new Date('2025-11-23T19:14:37.986Z');
      vi.setSystemTime(today);
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        mock(),
        mock(),
        mock()
      );

      const token = await client.getNewToken();

      expect(token).toEqual({
        token: mockGocardlessData.mockToken,
        tokenExpiresIn: 86400,
        refreshToken: mockGocardlessData.mockRefreshToken,
        refreshTokenExpiresIn: 2592000,
      });
    });
  });

  describe('refreshToken', () => {
    it('correctly refreshes the token and returns the resulting refreshed token', async () => {
      const today = new Date('2025-11-23T19:14:37.986Z');
      vi.setSystemTime(today);
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        mock(),
        mock(),
        mock()
      );

      const token = OauthToken.reconstitute({
        refreshExpiry: undefined,
        provider: 'ynab',
        id: 'foo',
        token: mockGocardlessData.mockToken,
        refreshToken: mockGocardlessData.mockRefreshToken,
        expiry: new Date(),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'user',
      });

      const refreshed = await client.refreshToken(token);

      expect(refreshed).toEqual({
        token: mockGocardlessData.mockRefreshedToken,
        tokenExpiresIn: 86400,
      });
    });
  });

  describe('getInstitutionList', () => {
    it('gets a list of institutions from gocardless', async () => {
      const today = new Date('2025-11-23T19:14:37.986Z');
      vi.setSystemTime(today);
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock(),
        mock(),
        mock(),
        mock()
      );

      const newToken = OauthToken.reconstitute({
        id: 'foo',
        refreshExpiry: undefined,
        provider: 'ynab',
        token: mockGocardlessData.mockToken,
        refreshToken: 'string',
        expiry: new Date(),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'ben',
      });

      const connections = await client.getInstitutionList(newToken);

      expect(connections).toEqual([
        {
          bankName: mockGocardlessData.mockInstititionsList[0]?.name ?? '',
          id: mockGocardlessData.mockInstititionsList[0]?.id ?? '',
          logo: mockGocardlessData.mockInstititionsList[0]?.logo ?? '',
        },
        {
          bankName: mockGocardlessData.mockInstititionsList[1]?.name ?? '',
          id: mockGocardlessData.mockInstititionsList[1]?.id ?? '',
          logo: mockGocardlessData.mockInstititionsList[1]?.logo ?? '',
        },
      ]);
    });
  });
});
