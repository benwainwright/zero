import { inject, type Accounts } from '@core';
import { Account } from '@zero/domain';
import { BaseRepo, type IKyselyTransactionManager } from '@zero/kysely-shared';
import { injectable } from 'inversify';
import type { Selectable } from 'kysely';
import type { DB } from '../core/database.ts';
import type { IWriteRepository } from '@zero/application-core';
import type { IAccountRepository } from '@zero/accounts';

@injectable()
export class PostgresAccountRepository
  extends BaseRepo<Account, [string]>
  implements IWriteRepository<Account>, IAccountRepository
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  public async list({
    userId,
    start,
    limit,
  }: {
    userId: string;
    start: number;
    limit: number;
  }): Promise<Account[]> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('accounts')
      .selectAll()
      .where((eb) =>
        eb.and([eb('ownerId', '=', userId), eb('deleted', '=', false)])
      )
      .offset(start)
      .limit(limit)
      .execute();

    return result.map(this.mapRaw);
  }

  public async update(account: Account): Promise<Account> {
    const tx = this.database.transaction();

    await tx
      .updateTable('accounts')
      .set(account.toObject())
      .where('id', '=', account.id)
      .execute();

    return account;
  }
  public async delete(account: Account): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('accounts').where('id', '=', account.id).execute();
  }

  private mapRaw(raw: Selectable<Accounts>) {
    return Account.reconstitute({
      ...raw,
      description: raw.description ?? undefined,
      linkedOpenBankingAccount: raw.linkedOpenBankingAccount ?? undefined,
    });
  }

  public async get(id: string): Promise<Account | undefined> {
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

  public async save(account: Account): Promise<Account> {
    const tx = this.database.transaction();

    await tx.insertInto('accounts').values(account.toObject()).execute();

    return account;
  }

  public async deleteAccount(account: Account): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('accounts').where('id', '=', account.id).execute();
  }
}
