import type { Role } from './role.ts';

export interface IRoleEvents {
  RoleCreated: Role;
  RoleUpdated: { old: Role; new: Role };
  RoleDeleted: Role;
}
