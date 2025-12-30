import type { ICapabilityList } from '@types';

export const userCapabilities = [
  `user:create`,
  `user:delete`,
  `user:read`,
  `user:update`,
  `user:list`,
] as const satisfies ICapabilityList<'user'>;

export const selfCapabilities = [
  `self:create`,
  `self:delete`,
  `self:read`,
  `self:update`,
] as const satisfies ICapabilityList<'self'>;
