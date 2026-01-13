import { inject } from '@core';
import type { AccountsCommands } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IUUIDGenerator,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import { Transaction, type ITransaction } from '@zero/domain';

export class CreateTransactionCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'CreateTransactionCommand'
> {
  public constructor(
    @inject('UUIDGenerator')
    private readonly uuidGenerator: IUUIDGenerator,

    @inject('TransactionWriter')
    private readonly txWriter: IWriteRepository<Transaction>,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
    command,
  }: ICommandContext<{
    id: string;
    key: 'CreateTransactionCommand';
    params: Omit<ITransaction, 'id' | 'ownerId'>;
  }>): Promise<void> {
    this.grants.requires({
      capability: 'account:create-transaction',
    });

    const id = this.uuidGenerator.v7();

    if (!authContext) {
      throw new Error('Must be logged in');
    }

    const theTx = Transaction.create({
      ...command,
      ownerId: authContext.id,
      id,
    });

    await this.txWriter.save(theTx);
  }
  public override readonly name = 'CreateTransactionCommand';
}
