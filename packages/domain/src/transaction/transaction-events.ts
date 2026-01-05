import type { Transaction } from './transaction.ts';

export interface ITransactionEvents {
  TransactionCreated: Transaction;
  TransactionDeleted: Transaction;
}
