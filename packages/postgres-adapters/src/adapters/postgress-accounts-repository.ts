import { inject, type Accounts } from '@core';
import type { IAccountRepository } from '@zero/accounts';
import { Account } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import { injectable } from 'inversify';
import type { Selectable } from 'kysely';
import type { DB } from '../core/database.ts';

@injectable()
export class PostgresAccountRepository implements IAccountRepository {
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {}
  public async requireAccount(id: string): Promise<Account> {
    const account = await this.getAccount(id);
    if (!account) {
      throw new Error('No account found!');
    }

    return account;
  }

  private mapRaw(raw: Selectable<Accounts>) {
    return Account.reconstitute({
      ...raw,
      description: raw.description ?? undefined,
    });
  }

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

    return this.mapRaw(result);
  }

  public async getUserAccounts(userId: string): Promise<Account[]> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('accounts')
      .selectAll()
      .where((eb) =>
        eb.and([eb('ownerId', '=', userId), eb('deleted', '=', false)])
      )
      .execute();

    return result.map(this.mapRaw);
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
          description: eb.ref('excluded.description'),
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
