import { inject } from '@core';
import type {
  ISyncDetailsRepository,
  IWriteRepository,
} from '@zero/application-core';
import { SyncDetails } from '@zero/domain';
import type { SyncDetails as DBSyncDetails } from '@core';
import type { Selectable } from 'kysely';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { DB } from '../core/database.ts';
import { BaseRepo } from './base-repo.ts';

export class PostgresSyncDetailsRepository
  extends BaseRepo<SyncDetails, [string]>
  implements IWriteRepository<SyncDetails>, ISyncDetailsRepository
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  public async save(details: SyncDetails): Promise<SyncDetails> {
    const tx = this.database.transaction();

    await tx.insertInto('sync_details').values(details.toObject()).execute();

    return details;
  }
  public async update(details: SyncDetails): Promise<SyncDetails> {
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
  public async delete(details: SyncDetails): Promise<void> {
    const tx = this.database.transaction();
    await tx.deleteFrom('sync_details').where('id', '=', details.id).execute();
  }

  public async get(id: string): Promise<SyncDetails | undefined> {
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
