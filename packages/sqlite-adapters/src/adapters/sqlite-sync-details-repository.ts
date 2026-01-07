import type { ISyncDetailsRepository } from '@zero/application-core';
import type { SyncDetails } from '@zero/domain';

export class SqliteSyncDetailsRepository implements ISyncDetailsRepository {
  public async saveSyncDetails(details: SyncDetails): Promise<SyncDetails> {
    throw new Error('Method not implemented.');
  }
  public async updateSyncDetails(details: SyncDetails): Promise<SyncDetails> {
    throw new Error('Method not implemented.');
  }
  public async deleteSyncDetails(details: SyncDetails): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public async getSyncDetails(id: string): Promise<SyncDetails> {
    throw new Error('Method not implemented.');
  }
}
