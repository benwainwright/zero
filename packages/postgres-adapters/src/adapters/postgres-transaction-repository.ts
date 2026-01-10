import { inject, type Transactions } from '@core';
import { Transaction } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { DB } from '../core/database.ts';
import type { IWriteRepository } from '@zero/application-core';
import { BaseRepo } from './base-repo.ts';
import type { ITransactionRepository } from '@zero/accounts';

export class PostgresTransactionRepository
  extends BaseRepo<Transaction, [txId: string]>
  implements IWriteRepository<Transaction>, ITransactionRepository
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  public async update(transaction: Transaction): Promise<Transaction> {
    const tx = this.database.transaction();
    await tx
      .updateTable('transactions')
      .set(transaction.toObject())
      .where('id', '=', transaction.id)
      .execute();
    return transaction;
  }

  public async delete(transaction: Transaction): Promise<void> {
    const tx = this.database.transaction();

    await tx
      .deleteFrom('transactions')
      .where('id', '=', transaction.id)
      .execute();
  }

  private mapRaw(raw: Selectable<Transactions>) {
    return Transaction.reconstitute({
      ...raw,
      categoryId: raw.categoryId ?? undefined,
    });
  }

  public async get(id: string): Promise<Transaction | undefined> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('transactions')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRaw(result);
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    const tx = this.database.transaction();

    await tx
      .insertInto('transactions')
      .values(transaction.toObject())
      .execute();

    return transaction;
  }

  public async count({
    userId,
    accountId,
  }: {
    userId: string;
    accountId: string;
  }): Promise<number> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('transactions')
      .select(({ fn }) => [fn.count<number>('id').as('transaction_count')])
      .where((eb) =>
        eb.and([eb('ownerId', '=', userId), eb('accountId', '=', accountId)])
      )
      .executeTakeFirstOrThrow();

    return Number(result.transaction_count);
  }
  public async list({
    userId,
    accountId,
    start,
    limit,
  }: {
    userId: string;
    accountId: string;
    start: number;
    limit: number;
  }): Promise<Transaction[]> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('transactions')
      .selectAll()
      .where((eb) =>
        eb.and([eb('ownerId', '=', userId), eb('accountId', '=', accountId)])
      )
      .offset(start)
      .limit(limit)
      .execute();

    return result.map((row) => this.mapRaw(row));
  }
}
