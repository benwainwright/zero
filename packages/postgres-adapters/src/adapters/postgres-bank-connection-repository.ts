import { inject, json, PostgressDatabase, type BankConnections } from '@core';
import type { IBankConnectionRepository } from '@zero/accounts';
import { BankConnection } from '@zero/domain';
import type { Selectable } from 'kysely';
import z from 'zod';
export class PostgresBankConnectionRepository
  implements IBankConnectionRepository
{
  public constructor(
    @inject('PostgresDatabase')
    private readonly database: PostgressDatabase
  ) {}

  private mapRaw(raw: Selectable<BankConnections>) {
    return BankConnection.reconstitute({
      ...raw,
      requisitionId: raw.requisitionId ?? undefined,
      accounts: z.array(z.string()).parse(raw.accounts),
    });
  }

  public async getConnection(
    userId: string
  ): Promise<BankConnection | undefined> {
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

  public async saveConnection(
    connection: BankConnection
  ): Promise<BankConnection> {
    const tx = this.database.transaction();

    await tx
      .insertInto('bank_connections')
      .values({
        ...connection.toObject(),
        accounts: connection.toObject().accounts
          ? json(connection.toObject().accounts)
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

  public async deleteConnection(connection: BankConnection): Promise<void> {
    const tx = this.database.transaction();

    await tx
      .deleteFrom('bank_connections')
      .where('id', '=', connection.id)
      .execute();
  }
}
