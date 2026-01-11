import type { BankConnection, ITransaction } from '@zero/domain';

export type AccountsCommands =
  | {
      id: string;
      key: 'DeleteAuthLinkCommand';
      params: undefined;
    }
  | {
      id: string;
      key: 'SaveRequisitionAccountsCommand';
      params: undefined;
    }
  | {
      id: string;
      key: 'CreateBankConnectionCommand';
      params: BankConnection;
    }
  | {
      id: string;
      key: 'FetchOpenBankingInstitutionListCommand';
      params: undefined;
    }
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
      params: Omit<ITransaction, 'id' | 'categoryId' | 'ownerId'>;
    }
  | {
      id: string;
      key: 'DeleteTransactionCommand';
      params: { transaction: string };
    }
  | {
      id: string;
      key: 'UpdateTransactionCommand';
      params: Partial<Omit<ITransaction, 'ownerId' | 'id'>> & { id: string };
    };
