import { inject, PostgressDatabase } from '@core';
import type { ISyncDetailsRepository } from '@zero/application-core';
import { SyncDetails } from '@zero/domain';
import type { SyncDetails as DBSyncDetails } from '@core';
import type { Selectable } from 'kysely';

export class PostgresSyncDetailsRepository implements ISyncDetailsRepository {
  public constructor(
    @inject('PostgresDatabase')
    private readonly database: PostgressDatabase
  ) {}

  public async saveSyncDetails(details: SyncDetails): Promise<SyncDetails> {
    const tx = this.database.transaction();

    await tx
      .insertInto('sync_details')
      .values(details.toObject())
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          ownerId: eb.ref('excluded.ownerId'),
          lastSync: eb.ref('excluded.lastSync'),
          checkpoint: eb.ref('excluded.checkpoint'),
        }))
      )
      .execute();

    return details;
  }
  public async updateSyncDetails(details: SyncDetails): Promise<SyncDetails> {
    const tx = this.database.transaction();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...values } = details.toObject();

    await tx
      .updateTable('sync_details')
      .set(values)
      .where('id', '=', details.id)
      .execute();

    return details;
  }

  private mapRaw(raw: Selectable<DBSyncDetails>) {
    return SyncDetails.reconstitute({
      ...raw,
      lastSync: raw.lastSync ?? undefined,
      checkpoint: raw.checkpoint ?? undefined,
    });
  }
  public async deleteSyncDetails(details: SyncDetails): Promise<void> {
    const tx = this.database.transaction();
    await tx.deleteFrom('sync_details').where('id', '=', details.id).execute();
  }
  public async getSyncDetails(id: string): Promise<SyncDetails | undefined> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('sync_details')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRaw(result);
  }
}
