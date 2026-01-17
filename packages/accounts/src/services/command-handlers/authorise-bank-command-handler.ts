import { inject } from '@core';
import type { IOpenBankingClient } from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class AuthoriseBankCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'AuthoriseBankCommand'
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
    params: { bankId },
  }: IRequestContext<{
    id: string;
    key: 'AuthoriseBankCommand';
    params: { bankId: string };
    response: { authUrl: string };
  }>): Promise<{ authUrl: string }> {
    this.grants.assertLogin(authContext);
    const token = await this.tokens.getToken(authContext.id);

    return { authUrl: await this.bank.getAuthorisationUrl(token, bankId) };
  }
  public override readonly name = 'AuthoriseBankCommand';
}
