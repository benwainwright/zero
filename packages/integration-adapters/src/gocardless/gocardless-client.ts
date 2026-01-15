import { inject, wait } from '@core';
import { HttpClient, type IResponseCache } from '@http-client';
import {
  type IInstitutionListFetcher,
  type IInstitutionAuthPageLinkFetcher,
  type IOpenBankingAccountBalanceFetcher,
  type IOpenBankingAccountDetailsFetcher,
  type IOpenBankingTokenFetcher,
  type IOpenBankingTokenRefresher,
  type IRequesitionAccountFetcher,
} from '@zero/accounts';
import {
  AppError,
  type IEventBus,
  type IStringHasher,
  type IUUIDGenerator,
} from '@zero/application-core';

import { type ConfigValue, type ILogger } from '@zero/bootstrap';
import { BankConnection, OauthToken } from '@zero/domain';
import { injectable } from 'inversify';
import z from 'zod';
import type { IntegrationEvents } from '../adapter-events.ts';
import { HttpError } from '@errors';

@injectable()
export class GocardlessClient
  implements
    IInstitutionListFetcher,
    IInstitutionAuthPageLinkFetcher,
    IOpenBankingTokenFetcher,
    IOpenBankingAccountBalanceFetcher,
    IOpenBankingTokenRefresher,
    IRequesitionAccountFetcher,
    IOpenBankingAccountDetailsFetcher
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

  public async pollAccountStatusUntilReady(
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

  private async getSingleAccountDetails(id: string, token: OauthToken) {
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

  public async getAccountDetails(
    ids: string[],
    token: OauthToken
  ): Promise<
    { id: string; name: string | undefined; details: string | undefined }[]
  > {
    return await Promise.all(
      ids.map(async (id) => {
        try {
          return await this.getSingleAccountDetails(id, token);
        } catch (error) {
          if (error instanceof HttpError && error.statusCode === 409) {
            await this.pollAccountStatusUntilReady(id, 10, token);
            return await this.getSingleAccountDetails(id, token);
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

  public async getAccountIds(
    bankConnection: BankConnection,
    token: OauthToken
  ): Promise<string[]> {
    const { accounts } = await this.client.get({
      path: `requisitions/${String(bankConnection.requisitionId)}/`,
      headers: {
        Authorization: `Bearer ${token.use()}`,
      },
      responseSchema: z.object({
        id: z.string(),
        status: z.string(),
        agreements: z.string().optional(),
        accounts: z.array(z.string()),
        reference: z.string(),
      }),
    });
    return accounts;
  }

  public async getLink(
    connection: BankConnection,
    token: OauthToken
  ): Promise<{ requsitionId: string; url: string }> {
    const result = await this.client.post({
      path: 'requisitions/',
      body: {
        institution_id: connection.id,
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

    return {
      url: result.link,
      requsitionId: result.id,
    };
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

  public async getConnections(
    ownerId: string,
    token: OauthToken
  ): Promise<BankConnection[]> {
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
          data.map((item) =>
            BankConnection.create({
              id: item.id,
              ownerId,
              bankName: item.name,
              logo: item.logo,
            })
          )
        ),
    });
  }
}
