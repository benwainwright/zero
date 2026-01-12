import type {
  Account,
  BankConnection,
  Category,
  Transaction,
} from '@zero/domain';

export type AccountsQueries =
  | {
      id: string;
      key: 'GetCategoryQuery';
      params: { category: string };
      response: Category | undefined;
    }
  | {
      id: string;
      key: 'ListCategoriesQuery';
      params: { offset: number; limit: number };
      response: { categories: Category[] };
    }
  | {
      id: string;
      key: 'GetBankAuthLinkQuery';
      params: undefined;
      response: { url: string | undefined };
    }
  | {
      id: string;
      key: 'CheckBankConnectionQuery';
      params: undefined;
      response:
        | {
            status: 'connected';
            logo: string;
            bankName: string;
            connected: Date;
            refreshed: Date | undefined;
            expires: Date;
          }
        | { status: 'not_connected' };
    }
  | {
      id: string;
      key: 'GetOpenBankingInstitutionList';
      paramse: undefined;
      response: BankConnection[] | undefined;
    }
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
