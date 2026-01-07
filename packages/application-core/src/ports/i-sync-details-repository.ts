import type { SyncDetails } from '@zero/domain';

export interface ISyncDetailsRepository {
  saveSyncDetails: (details: SyncDetails) => Promise<SyncDetails>;
  updateSyncDetails: (details: SyncDetails) => Promise<SyncDetails>;
  deleteSyncDetails: (details: SyncDetails) => Promise<void>;
  getSyncDetails: (id: string) => Promise<SyncDetails>;
}
