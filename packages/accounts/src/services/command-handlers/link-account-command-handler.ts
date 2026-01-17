import { inject } from '@core';
import type { IAccountRepository } from '@ports';
import type { AccountsCommands } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { Account } from '@zero/domain';

export class LinkAccountCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'LinkAccountCommand'
> {
  public constructor(
    @inject('AccountRepository')
    private readonly accounts: IAccountRepository,

    @inject('AccountWriter')
    private readonly writer: IWriteRepository<Account>,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    params: { localId, obAccountId },
  }: IRequestContext<{
    id: string;
    key: 'LinkAccountCommand';
    params: { localId: string; obAccountId: string };
    response: undefined;
  }>): Promise<undefined> {
    this.grants.requiresNoPermissions();
    const account = await this.accounts.require(localId);
    account.linkAccount(obAccountId);
    await this.writer.update(account);
  }

  public override readonly name = 'LinkAccountCommand';
}
