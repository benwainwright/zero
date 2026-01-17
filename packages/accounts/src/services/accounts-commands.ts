import type {
  IOpenBankingAccountDetails,
  OpenBankingConnectionStatus,
} from '@ports';
import type { ITransaction } from '@zero/domain';

interface IPossbileInstitution {
  bankName: string;
  id: string;
  logo: string;
}

export type AccountsCommands =
  | {
      id: string;
      key: 'GetOpenBankingAccountsCommand';
      params: undefined;
      response: IOpenBankingAccountDetails[];
    }
  | {
      id: string;
      key: 'CheckBankConnectionStatusCommand';
      params: undefined;
      response:
        | { status: 'not_connected'; banks: IPossbileInstitution[] }
        | {
            status: 'connected';
            name: string;
            logo: string;
            created: Date;
            refreshed: Date | undefined;
            expires: Date;
          }
        | Exclude<
            OpenBankingConnectionStatus,
            { status: 'not_connected' } | { status: 'connected' }
          >;
    }
  | {
      id: string;
      key: 'AuthoriseBankCommand';
      params: { bankId: string };
      response: { authUrl: string };
    }
  | {
      id: string;
      key: 'LinkAccountCommand';
      params: { localId: string; obAccountId: string };
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
