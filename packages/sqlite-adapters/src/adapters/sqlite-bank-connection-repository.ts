import { inject, type DB } from '@core';
import type { IBankConnectionRepository } from '@zero/accounts';
import { BankConnection } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { BankConnections } from '../core/database.ts';
import z from 'zod';
import type { IWriteRepository } from '@zero/application-core';
import { BaseRepo } from './base-repo.ts';

export class SqliteBankConnectionRepository
  extends BaseRepo<BankConnection, [string]>
  implements IBankConnectionRepository, IWriteRepository<BankConnection>
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  private mapValues(connection: BankConnection) {
    const values = connection.toObject();
    return {
      ...values,
      accounts: connection.toObject().accounts
        ? JSON.stringify(connection.toObject().accounts)
        : undefined,
    };
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

  private mapRaw(raw: Selectable<BankConnections>) {
    return BankConnection.reconstitute({
      ...raw,
      requisitionId: raw.requisitionId ?? undefined,
      accounts: z.array(z.string()).parse(JSON.parse(raw.accounts as string)),
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

  public async save(connection: BankConnection): Promise<BankConnection> {
    const tx = this.database.transaction();

    await tx
      .insertInto('bank_connections')
      .values({
        ...connection.toObject(),
        accounts: connection.toObject().accounts
          ? JSON.stringify(connection.toObject().accounts)
          : undefined,
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          bankName: eb.ref('excluded.bankName'),
          ownerId: eb.ref('excluded.ownerId'),
          requisitionId: eb.ref('excluded.requisitionId'),
          logo: eb.ref('excluded.logo'),
          accounts: eb.ref('excluded.accounts'),
        }))
      )
      .execute();

    return connection;
  }

  public async delete(connection: BankConnection): Promise<void> {
    const tx = this.database.transaction();

    await tx
      .deleteFrom('bank_connections')
      .where('id', '=', connection.id)
      .execute();
  }
}
