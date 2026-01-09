import { inject } from '@core';
import type { IAccountRepository } from '@ports';
import type { IDomainEventBuffer } from '@zero/application-core';
import type { Account } from '@zero/domain';

export class AccountsRepositoryEventsStager implements IAccountRepository {
  public constructor(
    @inject('AccountRepository')
    private readonly root: IAccountRepository,

    @inject('DomainEventBuffer')
    private readonly eventBuffer: IDomainEventBuffer
  ) {}

  public async getAccount(id: string): Promise<Account | undefined> {
    return await this.root.getAccount(id);
  }
  public async requireAccount(id: string): Promise<Account> {
    return await this.root.requireAccount(id);
  }
  public async getUserAccounts(userId: string): Promise<Account[]> {
    return await this.root.getUserAccounts(userId);
  }
  public async saveAccount(account: Account): Promise<Account> {
    this.eventBuffer.stageEvents(account);
    return await this.root.saveAccount(account);
  }

  public async deleteAccount(account: Account): Promise<void> {
    this.eventBuffer.stageEvents(account);
    return await this.root.deleteAccount(account);
  }
  public async saveAccounts(account: Account[]): Promise<Account[]> {
    account.forEach((account) => this.eventBuffer.stageEvents(account));
    return await this.root.saveAccounts(account);
  }
}
