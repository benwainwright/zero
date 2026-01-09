import type { ControlledTransaction } from 'kysely';

export interface IKyselyTransactionManager<DB> {
  transaction(): ControlledTransaction<DB, []>;
}
