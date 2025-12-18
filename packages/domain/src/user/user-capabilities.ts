import type { CapabilityList } from '@core';

export const userCapabilities = [
  `user:create`,
  `user:delete`,
  `user:read`,
  `user:update`,
] as const satisfies CapabilityList<'user'>;
