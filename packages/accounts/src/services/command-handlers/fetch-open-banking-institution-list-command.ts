import { inject } from '@core';
import type { AccountsCommands } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IObjectStorage,
} from '@zero/application-core';
import type { ILogger } from '@zero/bootstrap';
import type { OpenBankingTokenManager } from '../open-banking-token-manager.ts';
import type { IInstitutionListFetcher } from '@ports';
import type { IGrantManager } from '@zero/auth';
import { Serialiser } from '@zero/serialiser';

export class FetchOpenBankingInstitutionListCommand extends AbstractCommandHandler<
  AccountsCommands,
  'FetchOpenBankingInstitutionListCommand'
> {
  public constructor(
    @inject('OpenBankingTokenManager')
    private readonly tokenManager: OpenBankingTokenManager,

    @inject('InstitutionListFetcher')
    private institutionListFetcher: IInstitutionListFetcher,

    @inject('ObjectStore')
    private readonly store: IObjectStorage,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
  }: ICommandContext<{
    id: string;
    key: 'FetchOpenBankingInstitutionListCommand';
  }>): Promise<void> {
    this.grants.assertLogin(authContext);

    const token = await this.tokenManager.getToken(authContext.id);

    const connections = await this.institutionListFetcher.getConnections(
      authContext.id,
      token
    );

    const serialiser = new Serialiser();

    await this.store.set(
      'bank-connections',
      authContext.id,
      serialiser.serialise(connections)
    );
  }
  public override readonly name = 'FetchOpenBankingInstitutionListCommand';
}
