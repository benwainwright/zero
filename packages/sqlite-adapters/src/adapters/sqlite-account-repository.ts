import { inject } from '@core';
import type { IAccountRepository } from '@zero/accounts';
import { Account } from '@zero/domain';
import { BaseRepo, type IKyselyTransactionManager } from '@zero/kysely-shared';
import { injectable } from 'inversify';
import type { Selectable } from 'kysely';
import type { Accounts, DB } from '../core/database.ts';
import type { IWriteRepository } from '@zero/application-core';

@injectable()
export class SqliteAccountsRepository
  extends BaseRepo<Account, [string]>
  implements IAccountRepository, IWriteRepository<Account>
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  public async update(account: Account): Promise<Account> {
    const tx = this.database.transaction();

    await tx
      .updateTable('accounts')
      .set(this.mapValues(account))
      .where('id', '=', account.id)
      .execute();

    return account;
  }

  private mapRaw(raw: Selectable<Accounts>) {
    return Account.reconstitute({
      ...raw,
      description: raw.description ?? undefined,
      linkedOpenBankingAccount: raw.linkedOpenBankingAccount ?? undefined,
      closed: raw.closed === 'true',
      deleted: raw.deleted === 'true',
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
        eb.and([eb('ownerId', '=', userId), eb('deleted', '=', 'false')])
      )
      .offset(start)
      .limit(limit)
      .execute();

    return result.map(this.mapRaw);
  }

  private mapValues(account: Account) {
    return {
      ...account.toObject(),
      closed: String(account.closed),
      deleted: String(account.deleted),
    };
  }

  public async save(account: Account): Promise<Account> {
    const tx = this.database.transaction();

    await tx.insertInto('accounts').values(this.mapValues(account)).execute();

    return account;
  }

  public async delete(account: Account): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('accounts').where('id', '=', account.id).execute();
  }
}
