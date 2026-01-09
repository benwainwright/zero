import type { IKyselyDataSource } from './i-kysely-data-source.ts';
import type { IKyselyTransactionManager } from './i-kysely-transaction-manager.ts';

export interface IKyselySharedTypes<DB> {
  KyselyDataSource: IKyselyDataSource<DB>;
  KyselyTransactionManager: IKyselyTransactionManager<DB>;
}
