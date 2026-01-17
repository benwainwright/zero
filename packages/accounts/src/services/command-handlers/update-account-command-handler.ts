import {
  AbstractRequestHandler,
  type IRequestContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { AccountsCommands } from '../accounts-commands.ts';
import { injectable } from 'inversify';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';
import type { IAccountRepository } from '@ports';
import type { IGrantManager } from '@zero/auth';
import type { Account } from '@zero/domain';

@injectable()
export class UpdateAccountCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'UpdateAccountCommand'
> {
  public override readonly name = 'UpdateAccountCommand';

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
    params: { id, name, description },
  }: IRequestContext<{
    id: string;
    key: 'UpdateAccountCommand';
    params: { id: string; name: string; description: string };
    response: undefined;
  }>): Promise<undefined> {
    const account = await this.accounts.require(id);

    this.grants.requires({
      capability: 'account:update',
    });

    account.update({ name, description });

    await this.writer.update(account);
  }
}
