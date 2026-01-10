import type { ICapabilityList } from '@types';

export const tokenCaps = [
  `token:create`,
  `token:delete`,
  `token:read`,
  `token:update`,
  `token:refresh`,
] as const satisfies ICapabilityList<'token'>;
