import type { ITransaction } from '@zero/domain';

export type AccountsCommands =
  | {
      id: string;
      key: 'CreateAccountCommand';
      params: {
        name: string;
        description: string;
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
        id: string;
        name: string;
        description: string;
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
