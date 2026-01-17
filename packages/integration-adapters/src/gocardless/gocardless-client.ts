import { inject, wait } from '@core';
import { HttpClient, type IResponseCache } from '@http-client';

import {
  AppError,
  type IEventBus,
  type IObjectStorage,
  type IStringHasher,
  type IUUIDGenerator,
} from '@zero/application-core';

import { type ConfigValue, type ILogger } from '@zero/bootstrap';
import { OauthToken, openBankingTransactionSchema } from '@zero/domain';
import { injectable } from 'inversify';
import z from 'zod';
import type { IntegrationEvents } from '../adapter-events.ts';
import { HttpError } from '@errors';
import { REQUISITION_ID_KEY } from './constants.ts';
import type {
  IOpenBankingClient,
  IOpenBankingTokenFetcher,
  IOpenBankingTokenRefresher,
  OpenBankingConnectionStatus,
} from '@zero/accounts';

interface IPossbileInstitution {
  bankName: string;
  id: string;
  logo: string;
}

@injectable()
export class GocardlessClient
  implements
    IOpenBankingClient,
    IOpenBankingTokenFetcher,
    IOpenBankingTokenRefresher
{
  private client: HttpClient;

  public constructor(
    @inject('GocardlessClientSecretIdConfigValue')
    private secretId: ConfigValue<string>,

    @inject('GocardlessClientSecretKeyConfigValue')
    private secretKey: ConfigValue<string>,

    @inject('GocardlessRedirectUrlConfigValue')
    private redirectUrl: ConfigValue<string>,

    @inject('ResponseCache')
    responseCache: IResponseCache<unknown>,

    @inject('StringHasher')
    stringHasher: IStringHasher,

    @inject('UUIDGenerator')
    uuidGenerator: IUUIDGenerator,

    @inject('ObjectStore')
    private readonly objectStore: IObjectStorage,

    @inject('EventBus')
    eventBus: IEventBus<IntegrationEvents>,

    @inject('Logger')
    logger: ILogger
  ) {
    this.client = new HttpClient({
      baseUrl: `https://bankaccountdata.gocardless.com/api/v2`,
      logger,
      responseCache,
      eventBus,
      uuidGenerator,
      defaultTtl: 1000 * 60,
      stringHasher,
      defaultHeaders: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    });
  }

  public async getConnectionStatus(
    token: OauthToken
  ): Promise<OpenBankingConnectionStatus> {
    const requisitionId = await this.objectStore.get(
      REQUISITION_ID_KEY,
      token.id
    );

    if (!requisitionId) {
      return { status: 'not_connected' };
    }

    const requisition = await this.getRequisitionDetails(requisitionId, token);

    switch (requisition.status) {
      case 'CR':
      case 'GC':
      case 'UA':
      case 'SA':
      case 'GA':
        return { status: 'authorizing' };

      case 'RJ':
        return { status: 'rejected' };

      case 'LN': {
        const institutionDetails = await this.getInstitutionDetails(
          token,
          requisition.institution_id
        );
        return {
          status: 'connected',
          logo: institutionDetails.logo,
          name: institutionDetails.name,
        };
      }

      default:
        return { status: 'expired' };
    }
  }

  public async getAccountTransactions(token: OauthToken, account: string) {
    const response = await this.client.get({
      path: `accounts/${account}/transactions/`,
      ttl: 1000 * 60 * 60 * 24,
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z.object({
        transactions: z.object({
          booked: z.array(openBankingTransactionSchema),
          pending: z.array(openBankingTransactionSchema),
        }),
      }),
    });

    return response.transactions;
  }

  private async getInstitutionDetails(
    token: OauthToken,
    institutionId: string
  ) {
    return await this.client.get({
      path: `institutions/${institutionId}/`,
      ttl: 1000 * 60 * 60 * 24,
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z.object({
        name: z.string(),
        logo: z.string(),
      }),
    });
  }

  public async getInstitutionList(
    token: OauthToken
  ): Promise<IPossbileInstitution[]> {
    return await this.client.get({
      path: 'institutions',
      queryString: {
        country: 'GB',
      },
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            bic: z.string(),
            transaction_total_days: z.string(),
            countries: z.array(z.string()),
            logo: z.string(),
            max_access_valid_for_days: z.string(),
          })
        )
        .transform((data) =>
          data.map((item) => ({
            id: item.id,
            bankName: item.name,
            logo: item.logo,
          }))
        ),
    });
  }

  public async getAuthorisationUrl(
    token: OauthToken,
    bankId: string
  ): Promise<string> {
    const result = await this.client.post({
      path: 'requisitions/',
      body: {
        institution_id: bankId,
        redirect: await this.redirectUrl.value,
      },
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z.object({
        id: z.string(),
        created: z.string(),
        redirect: z.string(),
        status: z.string(),
        institution_id: z.string(),
        agreement: z.string(),
        reference: z.string(),
        link: z.string(),
      }),
    });

    this.objectStore.set(REQUISITION_ID_KEY, token.id, result.id);

    return result.link;
  }

  public async getAccounts(token: OauthToken) {
    const requisitionId = await this.objectStore.get(
      REQUISITION_ID_KEY,
      token.id
    );

    if (!requisitionId) {
      throw new AppError(
        `Authorisation has not been started - call 'getAuthoriseUrl' first and redirect the user to authorise with their bank`
      );
    }

    const requisition = await this.getRequisitionDetails(requisitionId, token);

    return await this.getAllAccountDetails(requisition.accounts, token);
  }

  private async getRequisitionDetails(id: string, token: OauthToken) {
    return await this.client.get({
      path: `requisitions/${id}/`,
      ttl: 0,
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z.object({
        id: z.string(),
        status: z.union([
          z.literal('CR'),
          z.literal('GC'),
          z.literal('UA'),
          z.literal('RJ'),
          z.literal('SA'),
          z.literal('GA'),
          z.literal('LN'),
          z.literal('EX'),
        ]),
        institution_id: z.string(),
        accounts: z.array(z.string()),
      }),
    });
  }

  private async getAccountStatus(
    id: string,
    token: OauthToken
  ): Promise<string> {
    const { status } = await this.client.get({
      path: `accounts/${id}/`,
      ttl: 0,
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z.object({ status: z.string() }),
    });

    return status;
  }

  private async pollAccountStatusUntilReady(
    id: string,
    timesToTry: number,
    token: OauthToken
  ) {
    let attempts = 0;
    do {
      const status = await this.getAccountStatus(id, token);
      if (status === 'READY') {
        return;
      }
      await wait(1000 * (attempts + 1));
      attempts++;
    } while (attempts < timesToTry);
    throw new AppError(`Account is not ready`);
  }

  private async getAccountDetails(id: string, token: OauthToken) {
    return await this.client.get({
      ttl: 1000 * 60 * 60 * 6,
      path: `accounts/${id}/details/`,
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z
        .object({
          account: z.object({
            resourceId: z.string(),
            name: z.string().optional(),
            details: z.string().optional(),
          }),
        })
        .transform((response) => ({
          id,
          name: response.account.name,
          details: response.account.details,
        })),
    });
  }

  private async getAllAccountDetails(
    ids: string[],
    token: OauthToken
  ): Promise<
    { id: string; name: string | undefined; details: string | undefined }[]
  > {
    return await Promise.all(
      ids.map(async (id) => {
        try {
          return await this.getAccountDetails(id, token);
        } catch (error) {
          if (error instanceof HttpError && error.statusCode === 409) {
            await this.pollAccountStatusUntilReady(id, 10, token);
            return await this.getAccountDetails(id, token);
          }
          throw error;
        }
      })
    );
  }

  public async getAccountBalance(
    id: string,
    token: OauthToken
  ): Promise<number> {
    const { balances } = await this.client.get({
      path: `accounts/${id}/balances/`,
      ttl: 1000 * 60 * 60 * 6,
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z.object({
        balances: z.array(
          z.object({
            referenceDate: z.string(),
            balanceAmount: z.object({
              amount: z
                .string()
                .transform((amount) => Number.parseFloat(amount) * 100),
              currency: z.string(),
            }),
          })
        ),
      }),
    });

    const [first] = balances.toSorted((a, b) =>
      new Date(a.referenceDate) > new Date(b.referenceDate) ? -1 : 1
    );

    if (!first) {
      throw new Error(`No balance returned!`);
    }

    return first.balanceAmount.amount;
  }

  public async refreshToken(token: OauthToken): Promise<{
    token: string;
    tokenExpiresIn: number;
  }> {
    const response = await this.client.post({
      body: {
        refresh: token.refreshToken,
      },
      path: `token/refresh/`,
      responseSchema: z.object({
        access: z.string(),
        access_expires: z.number(),
      }),
    });

    return { token: response.access, tokenExpiresIn: response.access_expires };
  }

  public async getNewToken() {
    return await this.client.post({
      path: 'token/new/',
      body: {
        secret_id: await this.secretId.value,
        secret_key: await this.secretKey.value,
      },
      responseSchema: z
        .object({
          access: z.string(),
          access_expires: z.number(),
          refresh: z.string(),
          refresh_expires: z.number(),
        })
        .transform((data) => ({
          token: data.access,
          refreshToken: data.refresh,
          tokenExpiresIn: data.access_expires,
          refreshTokenExpiresIn: data.refresh_expires,
        })),
    });
  }
}
