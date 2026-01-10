import type { Account, Transaction } from '@zero/domain';

export type AccountsQueries =
  | {
      id: string;
      key: 'GetAccountQuery';
      params: { id: string };
      response: Account;
    }
  | {
      id: string;
      key: 'ListUserAccountsQuery';
      params: { offset: number; limit: number };
      response: Account[];
    }
  | {
      id: string;
      key: 'GetTransactionQuery';
      params: { id: string };
      response: Transaction;
    }
  | {
      id: string;
      key: 'ListTransactionsQuery';
      params: {
        accountId: string;
        limit: number;
        offset: number;
      };
      response: { transactions: Transaction[]; total: number };
    };
