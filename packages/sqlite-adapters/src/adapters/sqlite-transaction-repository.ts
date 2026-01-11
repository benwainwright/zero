import { inject, type DB } from '@core';
import type { ITransactionRepository } from '@zero/accounts';
import { Category, Transaction } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { Categories, Transactions } from '../core/database.ts';
import type { IWriteRepository } from '@zero/application-core';
import { BaseRepo } from './base-repo.ts';

export class SqliteTransactionRepository
  extends BaseRepo<Transaction, [txId: string]>
  implements ITransactionRepository, IWriteRepository<Transaction>
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
      .set(this.mapValues(transaction))
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

  private mapRaw(
    raw: Selectable<
      Transactions & {
        categoryName: string | null;
        categoryId: string | null;
        categoryDescription: string | null;
        categoryOwnerId: string | null;
      }
    >
  ) {
    const category = raw.categoryId
      ? Category.reconstitute({
          name: raw.categoryName ?? '',
          description: raw.categoryDescription ?? '',
          id: raw.categoryId,
          ownerId: raw.categoryOwnerId ?? '',
        })
      : undefined;

    return Transaction.reconstitute({
      ...raw,
      date: new Date(raw.date),
      category,
    });
  }

  public async get(id: string): Promise<Transaction | undefined> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('transactions')
      .where('transactions.id', '=', id)
      .selectAll()
      .select(['transactions.id as id', 'transactions.ownerId as ownerId'])
      .leftJoin('categories', 'categories.id', 'transactions.categoryId')
      .select([
        'name as categoryName',
        'description as categoryDescription',
        'categories.id as categoryId',
        'categories.ownerId as categoryOwnerId',
      ])
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRaw(result);
  }

  private mapValues(transaction: Transaction) {
    const { category, ...values } = transaction.toObject();
    return {
      ...values,
      date: values.date.toISOString(),
      categoryId: category?.id ?? null,
    };
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    const tx = this.database.transaction();

    await tx
      .insertInto('transactions')
      .values(this.mapValues(transaction))
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
      .select(['transactions.id as id', 'transactions.ownerId as ownerId'])
      .where((eb) =>
        eb.and([
          eb('transactions.ownerId', '=', userId),
          eb('accountId', '=', accountId),
        ])
      )
      .leftJoin('categories', 'categories.id', 'transactions.categoryId')
      .select([
        'name as categoryName',
        'description as categoryDescription',
        'categories.id as categoryId',
        'categories.ownerId as categoryOwnerId',
      ])
      .offset(start)
      .limit(limit)
      .execute();

    return result.map((row) => this.mapRaw(row));
  }
}
