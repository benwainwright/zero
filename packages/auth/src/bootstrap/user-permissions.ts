import type { IPermission } from '@zero/domain';

export const userPermissions = [
  {
    capabilities: [`self:read`, `self:update`],
    action: 'ALLOW',
    resource: '*',
  },
] as const satisfies IPermission[];
