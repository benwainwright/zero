import type { ITransactionRepository } from '@zero/accounts';
import type { Transaction } from '@zero/domain';

export class SqliteTransactionRepository implements ITransactionRepository {
  public async getTransaction(id: string): Promise<Transaction | undefined> {
    throw new Error('Method not implemented.');
  }
  public async saveTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
  public async getAccountTransactionCount(
    userId: string,
    accountId: string
  ): Promise<number> {
    throw new Error('Method not implemented.');
  }
  public async getAccountTransactions(
    userId: string,
    accountId: string,
    offset: number,
    limit: number
  ): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }
  public async saveTransactions(
    transactions: Transaction[]
  ): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }
}
