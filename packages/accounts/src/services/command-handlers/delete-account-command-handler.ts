import {
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import type { AccountsCommands } from '../accounts-commands.ts';
import { injectable } from 'inversify';
import type { IAccountRepository } from '@ports';
import { inject } from '@core';
import type { ILogger } from '@zero/bootstrap';
import type { IGrantManager } from '@zero/auth';

@injectable()
export class DeleteAccountCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'DeleteAccountCommand'
> {
  public override readonly name = 'DeleteAccountCommand';

  public constructor(
    @inject('AccountRepository')
    private readonly accounts: IAccountRepository,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    command: { account },
  }: ICommandContext<{
    id: string;
    key: 'DeleteAccountCommand';
    params: { account: string };
  }>): Promise<void> {
    const theAccount = await this.accounts.requireAccount(account);

    this.grants.requires({
      capability: 'account:delete',
      for: theAccount,
    });

    theAccount.deleteAccount();
    await this.accounts.deleteAccount(theAccount);
  }
}
