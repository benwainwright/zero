import type { Account } from '@zero/domain';

export interface IAccountRepository {
  getAccount(id: string): Promise<Account | undefined>;
  getUserAccounts(userId: string): Promise<Account[]>;
  saveAccount(account: Account): Promise<Account>;
  deleteAccount(account: Account): Promise<void>;
  saveAccounts(account: Account[]): Promise<Account[]>;
}
