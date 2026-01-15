import { inject } from '@core';
import type { IBankConnectionRepository, IOauthTokenRepository } from '@ports';
import type { AccountsQueries } from '@services';
import {
  AbstractQueryHandler,
  AppError,
  type IQueryContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import { injectable } from 'inversify';

@injectable()
export class CheckBankConnectionQueryHandler extends AbstractQueryHandler<
  AccountsQueries,
  'CheckBankConnectionQuery'
> {
  public constructor(
    @inject('BankConnectionRepository')
    private readonly bankConnections: IBankConnectionRepository,

    @inject('OauthTokenRepository')
    private readonly tokenRepo: IOauthTokenRepository,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
  }: IQueryContext<{
    id: string;
    key: 'CheckBankConnectionQuery';
    params: undefined;
    response:
      | {
          status: 'connected';
          logo: string;
          bankName: string;
          connected: Date;
          refreshed: Date | undefined;
          expires: Date;
        }
      | { status: 'not_connected' };
  }>): Promise<
    | {
        status: 'connected';
        logo: string;
        bankName: string;
        connected: Date;
        refreshed: Date | undefined;
        expires: Date;
      }
    | { status: 'not_connected' }
  > {
    this.grants.assertLogin(authContext);

    this.grants.requires({
      capability: 'bank-connection:read',
    });

    const connection = await this.bankConnections.get(authContext.id);
    const token = await this.tokenRepo.get(authContext.id, 'open-banking');

    if (!connection || !token) {
      return { status: 'not_connected' };
    }

    return {
      status: 'connected',
      logo: connection.logo,
      bankName: connection.bankName,
      connected: token.created,
      refreshed: token.refreshed,
      expires: token.expiry,
    };
  }
  public override readonly name = 'CheckBankConnectionQuery';
}
