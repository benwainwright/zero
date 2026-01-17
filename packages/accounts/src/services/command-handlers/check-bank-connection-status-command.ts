import { inject } from '@core';
import type { IOpenBankingClient } from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractRequestHandler,
  type IPickRequest,
  type IRequestContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class CheckBankConnectionStatusCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'CheckBankConnectionStatusCommand'
> {
  public constructor(
    @inject('OpenBankingClient')
    private readonly bank: IOpenBankingClient,

    @inject('OpenBankingTokenManager')
    private readonly tokens: OpenBankingTokenManager,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
  }: IRequestContext<
    IPickRequest<AccountsCommands, 'CheckBankConnectionStatusCommand'>
  >): Promise<
    IPickRequest<
      AccountsCommands,
      'CheckBankConnectionStatusCommand'
    >['response']
  > {
    this.grants.assertLogin(authContext);
    this.grants.requiresNoPermissions();
    const token = await this.tokens.getToken(authContext.id);
    const status = await this.bank.getConnectionStatus(token);

    if (status.status === 'not_connected') {
      const banks = await this.bank.getInstitutionList(token);
      return { status: 'not_connected', banks };
    } else if (status.status === 'connected') {
      return {
        ...status,
        created: token.created,
        expires: token.expiry,
        refreshed: token.refreshed,
      };
    } else {
      return status;
    }
  }
  public override readonly name = 'CheckBankConnectionStatusCommand';
}
