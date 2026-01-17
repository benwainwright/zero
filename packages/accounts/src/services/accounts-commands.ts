import type { BankConnection, ITransaction } from '@zero/domain';

export type AccountsCommands =
  | {
      id: string;
      key: 'LinkAccountCommand';
      params: { localId: string; obAccountId: string };
      response: undefined;
    }
  | {
      id: string;
      key: 'FetchLinkedAccountsDetailsCommand';
      params: undefined;
      response: undefined;
    }
  | {
      id: string;
      key: 'CreateCategoryCommand';
      params: {
        name: string;
        description: string;
      };
      response: undefined;
    }
  | {
      id: string;
      key: 'DeleteCategoryCommand';
      params: {
        id: string;
      };
      response: undefined;
    }
  | {
      id: string;
      key: 'UpdateCategoryCommand';
      params: {
        id: string;
        name: string;
        description: string;
      };
      response: undefined;
    }
  | {
      id: string;
      key: 'DeleteAuthLinkCommand';
      params: undefined;
      response: undefined;
    }
  | {
      id: string;
      key: 'SaveRequisitionAccountsCommand';
      params: undefined;
      response: undefined;
    }
  | {
      id: string;
      key: 'CreateBankConnectionCommand';
      params: BankConnection;
      response: undefined;
    }
  | {
      id: string;
      key: 'FetchOpenBankingInstitutionListCommand';
      params: undefined;
      response: undefined;
    }
  | {
      id: string;
      key: 'CreateAccountCommand';
      params: {
        name: string;
        description: string;
      };
      response: undefined;
    }
  | {
      id: string;
      key: 'DeleteAccountCommand';
      params: { account: string };
      response: undefined;
    }
  | {
      id: string;
      key: 'UpdateAccountCommand';
      params: {
        id: string;
        name: string;
        description: string;
      };
      response: undefined;
    }
  | {
      id: string;
      key: 'CreateTransactionCommand';
      params: Omit<ITransaction, 'id' | 'categoryId' | 'ownerId'>;
      response: undefined;
    }
  | {
      id: string;
      key: 'DeleteTransactionCommand';
      params: { transaction: string };
      response: undefined;
    }
  | {
      id: string;
      key: 'UpdateTransactionCommand';
      params: Partial<Omit<ITransaction, 'ownerId' | 'id'>> & { id: string };
      response: undefined;
    };
