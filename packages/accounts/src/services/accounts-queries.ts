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
      key: 'GetAccountsQuery';
      params: { limit: number; offset: number };
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
      key: 'GetTransactionsQuery';
      params: {
        limit: number;
        offset: number;
      };
    };
