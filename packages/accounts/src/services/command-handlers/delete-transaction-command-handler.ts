import { inject } from '@core';
import type { ITransactionRepository } from '@ports';
import type { AccountsCommands } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { Transaction } from '@zero/domain';

export class DeleteTransactionCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'DeleteTransactionCommand'
> {
  public constructor(
    @inject('TransactionRepository')
    private readonly accounts: ITransactionRepository,

    @inject('TransactionWriter')
    private readonly writer: IWriteRepository<Transaction>,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }
  protected override async handle({
    params: { transaction },
  }: IRequestContext<{
    id: string;
    key: 'DeleteTransactionCommand';
    params: { transaction: string };
    response: undefined;
  }>): Promise<undefined> {
    this.grants.requires({
      capability: 'account:delete-transaction',
    });

    const tx = await this.accounts.require(transaction);

    tx.delete();

    this.writer.delete(tx);
  }
  public override readonly name = 'DeleteTransactionCommand';
}
