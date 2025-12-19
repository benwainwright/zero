import type { User } from '@zero/domain';

export interface IUserRepository {
  save(user: User): Promise<User>;
  get(id: string): Promise<User | undefined>;
  delete(user: User): Promise<void>;
}
