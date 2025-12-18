import type { User } from '@zero/domain';

export interface ICurrentUserCache {
  get(): Promise<User | undefined>;
}
