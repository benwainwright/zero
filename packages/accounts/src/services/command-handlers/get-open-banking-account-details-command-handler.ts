import { inject } from '@core';
import type { IOpenBankingAccountDetails, IOpenBankingClient } from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class GetOpenBankingAccountDetailsCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'GetOpenBankingAccountsCommand'
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
  }: IRequestContext<{
    id: string;
    key: 'GetOpenBankingAccountsCommand';
    params: undefined;
    response: IOpenBankingAccountDetails[];
  }>): Promise<IOpenBankingAccountDetails[]> {
    this.grants.requiresNoPermissions();
    this.grants.assertLogin(authContext);

    await using token = await this.tokens.getToken(authContext.id);

    return this.bank.getAccounts(token);
  }

  public override readonly name = 'GetOpenBankingAccountsCommand';
}
