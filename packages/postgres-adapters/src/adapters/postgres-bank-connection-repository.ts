import { inject, json, type BankConnections } from '@core';
import { BankConnection } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import z from 'zod';
import type { DB } from '../core/database.ts';
import type { IWriteRepository } from '@zero/application-core';
import { BaseRepo } from './base-repo.ts';
import type { IInstitutionListFetcher } from '@zero/accounts';

export class PostgresBankConnectionRepository
  extends BaseRepo<BankConnection, [string]>
  implements IInstitutionListFetcher, IWriteRepository<BankConnection>
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  private mapRaw(raw: Selectable<BankConnections>) {
    return BankConnection.reconstitute({
      ...raw,
      requisitionId: raw.requisitionId ?? undefined,
      accounts: z.array(z.string()).parse(raw.accounts),
    });
  }

  public async get(userId: string): Promise<BankConnection | undefined> {
    const tx = this.database.transaction();
    const result = await tx
      .selectFrom('bank_connections')
      .selectAll()
      .where('ownerId', '=', userId)
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRaw(result);
  }

  private mapValues(connection: BankConnection) {
    const values = connection.toObject();
    return {
      ...values,
      accounts: connection.toObject().accounts
        ? json(connection.toObject().accounts)
        : undefined,
    };
  }

  public async save(connection: BankConnection): Promise<BankConnection> {
    const tx = this.database.transaction();

    await tx
      .insertInto('bank_connections')
      .values(this.mapValues(connection))
      .execute();

    return connection;
  }

  public async update(entity: BankConnection): Promise<BankConnection> {
    const tx = this.database.transaction();
    await tx
      .updateTable('bank_connections')
      .set(this.mapValues(entity))
      .where('id', '=', entity.id)
      .execute();

    return entity;
  }

  public async delete(connection: BankConnection): Promise<void> {
    const tx = this.database.transaction();

    await tx
      .deleteFrom('bank_connections')
      .where('id', '=', connection.id)
      .execute();
  }
}
