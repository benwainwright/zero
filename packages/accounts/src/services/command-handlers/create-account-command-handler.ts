import {
  AbstractRequestHandler,
  type IRequestContext,
  type IUUIDGenerator,
  type IWriteRepository,
} from '@zero/application-core';
import type { AccountsCommands } from '../accounts-commands.ts';
import { injectable } from 'inversify';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';
import { Account } from '@zero/domain';
import type { IGrantManager } from '@zero/auth';

@injectable()
export class CreateAccountCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'CreateAccountCommand'
> {
  public constructor(
    @inject('UUIDGenerator')
    private readonly uuidGenerator: IUUIDGenerator,

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
    params: { name, description },
    authContext,
  }: IRequestContext<{
    id: string;
    key: 'CreateAccountCommand';
    params: { name: string; description: string };
    response: undefined;
  }>): Promise<undefined> {
    this.grants.requires({
      capability: 'account:list',
    });

    this.grants.assertLogin(authContext);
    const id = this.uuidGenerator.v7();

    const newAccount = Account.create({
      id,
      description,
      name,
      ownerId: authContext.id,
    });

    await this.writer.save(newAccount);
  }

  public override readonly name = 'CreateAccountCommand';
}
