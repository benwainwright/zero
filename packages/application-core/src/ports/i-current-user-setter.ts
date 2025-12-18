import type { User } from '@zero/domain';

export interface ICurrentUserSetter {
  set(user: User | undefined): Promise<void>;
}
