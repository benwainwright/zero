import type { User } from '@zero/domain';

export interface IUserRepository {
  saveUser(user: User): Promise<User>;
  requireUser(id: string): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  getManyUsers(start?: number, limit?: number): Promise<User[]>;
  deleteUser(user: User): Promise<void>;
}
