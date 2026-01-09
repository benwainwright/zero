import { inject, type DB } from '@core';
import type { ITransactionRepository } from '@zero/accounts';
import { Transaction } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { Transactions } from '../core/database.ts';

export class SqliteTransactionRepository implements ITransactionRepository {
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {}

  private mapRaw(raw: Selectable<Transactions>) {
    return Transaction.reconstitute({
      ...raw,
      date: new Date(raw.date),
      categoryId: raw.categoryId ?? undefined,
    });
  }

  public async getTransaction(id: string): Promise<Transaction | undefined> {
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
  public async saveTransaction(transaction: Transaction): Promise<Transaction> {
    const tx = this.database.transaction();
    const values = transaction.toObject();

    await tx
      .insertInto('transactions')
      .values({
        ...values,
        date: values.date.toISOString(),
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          ownerId: eb.ref('excluded.ownerId'),
          amount: eb.ref('excluded.amount'),
          payee: eb.ref('excluded.payee'),
          accountId: eb.ref('excluded.accountId'),
          date: eb.ref('excluded.date'),
          categoryId: eb.ref('excluded.categoryId'),
        }))
      )
      .execute();

    return transaction;
  }

  public async getAccountTransactionCount(
    userId: string,
    accountId: string
  ): Promise<number> {
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
  public async getAccountTransactions(
    userId: string,
    accountId: string,
    offset: number,
    limit: number
  ): Promise<Transaction[]> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('transactions')
      .selectAll()
      .where((eb) =>
        eb.and([eb('ownerId', '=', userId), eb('accountId', '=', accountId)])
      )
      .offset(offset)
      .limit(limit)
      .execute();

    return result.map((row) => this.mapRaw(row));
  }
  public async saveTransactions(
    transactions: Transaction[]
  ): Promise<Transaction[]> {
    for (const tx of transactions) {
      await this.saveTransaction(tx);
    }

    return transactions;
  }
}
