import type { IPermission } from '@zero/domain';

export const adminPermissions: IPermission[] = [
  {
    capabilities: ['all'],
    action: 'ALLOW',
    resource: '*',
  },
];
