import { inject, type PostgressDatabase } from '@core';
import type { IAccountRepository } from '@zero/accounts';
import { Account } from '@zero/domain';
import { injectable } from 'inversify';

@injectable()
export class PostgresAccountRepository implements IAccountRepository {
  public constructor(
    @inject('PostgresDatabase')
    private readonly database: PostgressDatabase
  ) {}

  public async getAccount(id: string): Promise<Account | undefined> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('accounts')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return Account.reconstitute(result);
  }

  public async getUserAccounts(userId: string): Promise<Account[]> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('accounts')
      .selectAll()
      .where('ownerId', '=', userId)
      .execute();

    return result.map((row) => Account.reconstitute(row));
  }

  public async saveAccount(account: Account): Promise<Account> {
    const tx = this.database.transaction();

    await tx
      .insertInto('accounts')
      .values(account.toObject())
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          name: eb.ref('excluded.name'),
          type: eb.ref('excluded.type'),
          closed: eb.ref('excluded.closed'),
          balance: eb.ref('excluded.balance'),
          deleted: eb.ref('excluded.deleted'),
          ownerId: eb.ref('excluded.ownerId'),
        }))
      )
      .execute();

    return account;
  }

  public async deleteAccount(account: Account): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('accounts').where('id', '=', account.id).execute();
  }

  public async saveAccounts(accounts: Account[]): Promise<Account[]> {
    for (const account of accounts) {
      await this.saveAccount(account);
    }
    return accounts;
  }
}
