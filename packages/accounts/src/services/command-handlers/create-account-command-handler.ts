import {
  AbstractCommandHandler,
  AppError,
  type ICommandContext,
  type IUUIDGenerator,
} from '@zero/application-core';
import type { AccountsCommands } from '../accounts-commands.ts';
import { injectable } from 'inversify';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';
import type { IAccountRepository } from '@ports';
import { Account } from '@zero/domain';
import type { IGrantManager } from '@zero/auth';

@injectable()
export class CreateAccountCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'CreateAccountCommand'
> {
  public constructor(
    @inject('UUIDGenerator')
    private readonly uuidGenerator: IUUIDGenerator,

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
    command: { name, description },
    authContext,
  }: ICommandContext<{
    id: string;
    key: 'CreateAccountCommand';
    params: { name: string; description: string };
  }>): Promise<void> {
    this.grants.requires({
      capability: 'account:list',
    });

    if (!authContext) {
      throw new AppError('Must be logged in');
    }

    const id = this.uuidGenerator.v7();

    const newAccount = Account.create({
      id,
      description,
      name,
      ownerId: authContext.id,
    });

    await this.accounts.saveAccount(newAccount);
  }
  public override readonly name = 'CreateAccountCommand';
}
