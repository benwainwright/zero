import { inject } from '@core';
import type { IOpenBankingClient } from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class SyncTransactionsCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'SyncTransactionsCommandHandler'
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
    params: { accountId },
  }: IRequestContext<{
    id: string;
    key: 'SyncTransactionsCommandHandler';
    params: { accountId: string };
    response: undefined;
  }>): Promise<undefined> {
    this.grants.assertLogin(authContext);
    this.grants.requiresNoPermissions();
    const token = await this.tokens.getToken(authContext.id);
    const transactions = await this.bank.getAccountTransactions(
      token,
      accountId
    );
  }

  public override readonly name = 'SyncTransactionsCommandHandler';
}
