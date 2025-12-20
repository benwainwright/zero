import type { Role } from '@zero/domain';

export interface IRoleRepository {
  getRole(id: string): Promise<Role | undefined>;
  saveRole(role: Role): Promise<Role>;
  getManyRoles(offset: number, limit: number): Promise<Role[]>;
}
