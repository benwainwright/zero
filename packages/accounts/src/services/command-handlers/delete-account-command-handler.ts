import {
  AbstractRequestHandler,
  type IRequestContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { AccountsCommands } from '../accounts-commands.ts';
import { injectable } from 'inversify';
import type { IAccountRepository } from '@ports';
import { inject } from '@core';
import type { ILogger } from '@zero/bootstrap';
import type { IGrantManager } from '@zero/auth';
import type { Account } from '@zero/domain';

@injectable()
export class DeleteAccountCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'DeleteAccountCommand'
> {
  public override readonly name = 'DeleteAccountCommand';

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
    params: { account },
  }: IRequestContext<{
    id: string;
    key: 'DeleteAccountCommand';
    params: { account: string };
    response: undefined;
  }>): Promise<undefined> {
    const theAccount = await this.accounts.require(account);

    this.grants.requires({
      capability: 'account:delete',
      for: theAccount,
    });

    theAccount.deleteAccount();
    await this.writer.delete(theAccount);
  }
}
