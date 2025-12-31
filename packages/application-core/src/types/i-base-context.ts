import type { User } from '@zero/domain';

export interface IBaseContext {
  authContext: User | undefined;
  id: string;
}
