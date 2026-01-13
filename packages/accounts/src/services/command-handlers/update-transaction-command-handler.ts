import { inject } from '@core';
import type { ITransactionRepository } from '@ports';
import type { AccountsCommands } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { ITransaction, Transaction } from '@zero/domain';

export class UpdateTransactionCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'UpdateTransactionCommand'
> {
  public constructor(
    @inject('TransactionRepository')
    private readonly txRepo: ITransactionRepository,

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
    command,
  }: ICommandContext<{
    id: string;
    key: 'UpdateTransactionCommand';
    params: Omit<ITransaction, 'ownerId'>;
  }>): Promise<void> {
    this.grants.requires({
      capability: 'account:create-transaction',
    });

    const { id, ...data } = command;
    const tx = await this.txRepo.require(id);

    tx.update(data);

    await this.txWriter.update(tx);
  }
  public override readonly name = 'UpdateTransactionCommand';
}
