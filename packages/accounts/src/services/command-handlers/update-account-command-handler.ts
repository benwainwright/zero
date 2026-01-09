import {
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import type { AccountsCommands } from '../accounts-commands.ts';
import { injectable } from 'inversify';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';
import type { IAccountRepository } from '@ports';
import type { IGrantManager } from '@zero/auth';

@injectable()
export class UpdateAccountCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'UpdateAccountCommand'
> {
  public override readonly name = 'UpdateAccountCommand';

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
    command: { id, name, description },
  }: ICommandContext<{
    id: string;
    key: 'UpdateAccountCommand';
    params: { id: string; name: string; description: string };
  }>): Promise<void> {
    const account = await this.accounts.requireAccount(id);

    this.grants.requires({
      capability: 'account:update',
    });

    account.update({ name, description });

    await this.accounts.saveAccount(account);
  }
}
