import { server } from '@test-helpers';
import { GocardlessClient } from './gocardless-client.ts';
import { mockGocardlessData } from '../test-helpers/msw/index.ts';
import { mock } from 'vitest-mock-extended';
import { BankConnection, OauthToken } from '@zero/domain';

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
  describe('getAccountBalance', () => {
    it('returns the value of the most recent balance entry', async () => {
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
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

  describe('getAccountDetails', () => {
    it('makes multiple requests and aggregates them', async () => {
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
        mock(),
        mock(),
        mock()
      );

      const connection = BankConnection.reconstitute({
        bankName: 'foo',
        id: mockGocardlessData.mockRequisitionResponse.institution_id,
        ownerId: 'ben',
        logo: 'bar',
        requisitionId: 'baz',
      });

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

      const result = await client.getLink(connection, token);

      expect(result.url).toEqual(
        mockGocardlessData.mockRequisitionResponse.link
      );
      expect(result.requsitionId).toEqual(
        mockGocardlessData.mockRequisitionResponse.id
      );
    });
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

  describe('getconnections', () => {
    it('gets a token, then makes a request to the institutions endpoint and returns a list of bankconnectionsl', async () => {
      const today = new Date('2025-11-23T19:14:37.986Z');
      vi.setSystemTime(today);
      const client = new GocardlessClient(
        { value: Promise.resolve(mockGocardlessData.secretId) },
        { value: Promise.resolve(mockGocardlessData.secretKey) },
        { value: Promise.resolve(mockGocardlessData.mockRedirectUrl) },
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
        ownerId: 'user',
      });

      const connections = await client.getConnections('ben', newToken);

      expect(connections).toEqual([
        BankConnection.reconstitute({
          bankName: mockGocardlessData.mockInstititionsList[0]?.name ?? '',
          id: mockGocardlessData.mockInstititionsList[0]?.id ?? '',
          logo: mockGocardlessData.mockInstititionsList[0]?.logo ?? '',
          ownerId: 'ben',
        }),
        BankConnection.reconstitute({
          bankName: mockGocardlessData.mockInstititionsList[1]?.name ?? '',
          id: mockGocardlessData.mockInstititionsList[1]?.id ?? '',
          logo: mockGocardlessData.mockInstititionsList[1]?.logo ?? '',
          ownerId: 'ben',
        }),
      ]);
    });
  });
});
