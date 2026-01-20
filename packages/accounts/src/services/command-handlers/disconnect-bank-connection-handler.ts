import { inject, type AccountsEvents } from '@core';
import type { IOpenBankingClient } from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractRequestHandler,
  type IAllEvents,
  type IEventBus,
  type IRequestContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class DisconnectBankConnectionHandler extends AbstractRequestHandler<
  AccountsCommands,
  'DisconnectBankConnectionCommand'
> {
  public constructor(
    @inject('OpenBankingClient')
    private readonly bank: IOpenBankingClient,

    @inject('OpenBankingTokenManager')
    private readonly tokens: OpenBankingTokenManager,

    @inject('EventBus')
    private readonly events: IEventBus<IAllEvents & AccountsEvents>,


    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle(
    {authContext}: IRequestContext<{
      id: string;
      key: 'DisconnectBankConnectionCommand';
      params: undefined;
      response: undefined;
    }>
  ): Promise<undefined> {
    this.grants.assertLogin(authContext);
    this.grants.requiresNoPermissions()
    await using token = await this.tokens.getToken(authContext.id)

    await this.bank.disconnect(token);
    this.events.emit("BankIntegrationDisconnected", undefined)
  }

  public override readonly name = 'DisconnectBankConnectionCommand';
}
