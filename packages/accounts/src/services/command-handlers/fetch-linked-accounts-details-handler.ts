import { ACCOUNT_DETAILS_KEY } from '@constants';
import { inject } from '@core';
import type {
  IBankConnectionRepository,
  IOpenBankingAccountDetailsFetcher,
  IRequesitionAccountFetcher,
} from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IObjectStorage,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { BankConnection } from '@zero/domain';

export class FetchLinkedAccountDetailsCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'FetchLinkedAccountsDetailsCommand'
> {
  public constructor(
    @inject('OpenBankingTokenManager')
    private readonly tokenManager: OpenBankingTokenManager,

    @inject('RequestionAccountFetcher')
    private accountIdFetcher: IRequesitionAccountFetcher,

    @inject('BankConnectionRepository')
    private readonly connectionReader: IBankConnectionRepository,

    @inject('BankConnectionWriter')
    private connectionWriter: IWriteRepository<BankConnection>,

    @inject("ObjectStore")
    private objectStore: IObjectStorage,

    @inject("OpenBankingAccountDetailsFetcher")
    private readonly accountDetailsFetcher: IOpenBankingAccountDetailsFetcher,

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
    key: 'FetchLinkedAccountsDetailsCommand';
    params: undefined;
  }>): Promise<void> {
    this.grants.requiresNoPermissions();
    this.grants.assertLogin(authContext);
    const connection = await this.connectionReader.require(authContext.id);
    await using token = await this.tokenManager.getToken(authContext.id);

    if (!connection.accounts || connection.accounts.length === 0) {
      const accounts = await this.accountIdFetcher.getAccountIds(connection, token)
      connection.saveAccounts(accounts);
    }

    if (connection.accounts) {
      const details = await this.accountDetailsFetcher.getAccountDetails(connection.accounts, token);
      this.objectStore.set(ACCOUNT_DETAILS_KEY, authContext.id, JSON.stringify(details))
    }

    await this.connectionWriter.update(connection);
  }

  public override readonly name = 'FetchLinkedAccountsDetailsCommand';
}
