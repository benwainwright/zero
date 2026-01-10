import { inject } from '@core';
import type { ITransactionRepository } from '@ports';
import type { AccountsQueries } from '@services';
import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { Transaction } from '@zero/domain';

export class ListTransactionsQueryHandler extends AbstractQueryHandler<
  AccountsQueries,
  'ListTransactionsQuery'
> {
  public constructor(
    @inject('TransactionRepository')
    private readonly txRepo: ITransactionRepository,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
    query: { limit, offset, accountId },
  }: IQueryContext<{
    id: string;
    key: 'ListTransactionsQuery';
    params: { limit: number; offset: number; accountId: string };
    response: { transactions: Transaction[]; total: number };
  }>): Promise<{ transactions: Transaction[]; total: number }> {
    this.grants.requires({
      capability: 'account:list-transactions',
    });

    if (!authContext) {
      throw new Error('Must be logged in');
    }

    return {
      total: await this.txRepo.count({
        accountId,
        userId: authContext.id,
      }),

      transactions: await this.txRepo.list({
        start: offset,
        limit,
        accountId,
        userId: authContext.id,
      }),
    };
  }
  public override readonly name = 'ListTransactionsQuery';
}
