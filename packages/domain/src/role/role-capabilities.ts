import type { ICapabilityList } from '@types';

export const roleCapabilities = [
  `role:create`,
  `role:delete`,
  `role:read`,
  `role:update`,
  `role:list`,
] as const satisfies ICapabilityList<'role'>;
