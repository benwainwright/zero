import type { IReadRepository } from '@ports';
import type { SyncDetails } from '@zero/domain';

export type ISyncDetailsRepository = IReadRepository<SyncDetails, [id: string]>;
