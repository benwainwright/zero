import type { Role } from '@zero/domain';

export interface IRoleRepository {
  get(id: string): Promise<Role>;
  save(role: Role): Promise<Role>;
}
