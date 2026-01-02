import type { Role } from '@zero/domain';

export interface IRoleRepository {
  getRole(id: string): Promise<Role | undefined>;
  requireRole(id: string): Promise<Role>;
  saveRole(role: Role): Promise<Role>;
  getManyRoles(offset: number, limit: number): Promise<Role[]>;
}
