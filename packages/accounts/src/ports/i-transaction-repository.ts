import type {
  IBulkGetRepository,
  ICountableRepository,
  IListRepository,
  IPresenceRepository,
  IReadRepository,
} from '@zero/application-core';
import type { Transaction } from '@zero/domain';

export type ITransactionRepository = IReadRepository<
  Transaction,
  [txId: string]
> &
  IListRepository<Transaction, { userId: string; accountId: string }> &
  ICountableRepository<{ userId: string; accountId: string }> &
  IPresenceRepository &
  IBulkGetRepository<Transaction>;
