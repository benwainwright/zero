import type { BankConnection } from '@zero/domain';

export interface IBankConnectionRepository {
  getConnection(userId: string): Promise<BankConnection | undefined>;
  saveConnection(connection: BankConnection): Promise<BankConnection>;
  deleteConnection(connection: BankConnection): Promise<void>;
}
