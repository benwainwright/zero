import { inject, type AccountsEvents } from '@core';
import type { AccountsCommands } from '@services';
import {
  AbstractCommandHandler,
  type IAllEvents,
  type ICommandContext,
  type IEventBus,
  type IObjectStorage,
} from '@zero/application-core';
import type { ILogger } from '@zero/bootstrap';
import type { OpenBankingTokenManager } from '../open-banking-token-manager.ts';
import type { IInstitutionListFetcher } from '@ports';
import type { IGrantManager } from '@zero/auth';
import { Serialiser } from '@zero/serialiser';
import { INSTITUTION_LIST_STORAGE_KEY } from '@constants';

export class FetchOpenBankingInstitutionListCommandHandler extends AbstractCommandHandler<
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

    @inject('EventBus')
    private readonly eventBus: IEventBus<AccountsEvents & IAllEvents>,

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

    await using token = await this.tokenManager.getToken(authContext.id);


    const connections = await this.institutionListFetcher.getConnections(
      authContext.id,
      token
    );

    const serialiser = new Serialiser();

    await this.store.set(
      INSTITUTION_LIST_STORAGE_KEY,
      authContext.id,
      serialiser.serialise(connections)
    );

    this.eventBus.emit('InstitutionListFetchedEvent', undefined);
  }

  public override readonly name = 'FetchOpenBankingInstitutionListCommand';
}
