import type { IBankConnectionRepository } from '@zero/accounts';
import type { BankConnection } from '@zero/domain';
export class SqliteBankConnectionRepository
  implements IBankConnectionRepository
{
  public async getConnection(
    userId: string
  ): Promise<BankConnection | undefined> {
    throw new Error('Method not implemented.');
  }

  public async saveConnection(
    connection: BankConnection
  ): Promise<BankConnection> {
    throw new Error('Method not implemented.');
  }

  public async deleteConnection(connection: BankConnection): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
