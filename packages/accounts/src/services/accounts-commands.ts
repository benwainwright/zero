import type { ITransaction } from '@zero/domain';

export type AccountsCommands =
  | {
      id: string;
      key: 'CreateAccountCommand';
      params: {
        username: string;
        password: string;
        email: string;
      };
    }
  | {
      id: string;
      key: 'DeleteAccountCommand';
      params: { account: string };
    }
  | {
      id: string;
      key: 'UpdateAccountCommand';
      params: {
        username: string;
        password: string;
        email: string;
      };
    }
  | {
      id: string;
      key: 'CreateTransactionCommand';
      params: Omit<ITransaction, 'id'>;
    }
  | {
      id: string;
      key: 'UpdateTransactionCommand';
      params: ITransaction;
    };
