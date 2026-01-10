import { inject } from '@core';
import type {
  IBankConnectionRepository,
  IRequesitionAccountFetcher,
} from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { BankConnection } from '@zero/domain';

export class SaveRequisitionAccountsCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'SaveRequisitionAccountsCommand'
> {
  public constructor(
    @inject('OpenBankingTokenManager')
    private readonly tokenManager: OpenBankingTokenManager,

    @inject('RequestionAccountFetcher')
    private readonly fetcher: IRequesitionAccountFetcher,

    @inject('BankConnectionRepository')
    private readonly connectionRepo: IBankConnectionRepository,

    @inject('BankConnectionWriter')
    private readonly writer: IWriteRepository<BankConnection>,

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
    key: 'SaveRequisitionAccountsCommand';
    params: undefined;
  }>): Promise<void> {
    this.grants.assertLogin(authContext);

    this.grants.requires({
      capability: 'bank-connection:read',
    });

    this.grants.requires({
      capability: 'bank-connection:update',
    });

    const token = await this.tokenManager.getToken(authContext.id);

    const connection = await this.connectionRepo.require(authContext.id);

    const accounts = await this.fetcher.getAccountIds(connection, token);
    connection.saveAccounts(accounts);

    await this.writer.save(connection);
  }
  public override readonly name = 'SaveRequisitionAccountsCommand';
}
