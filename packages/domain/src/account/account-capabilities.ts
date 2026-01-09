import type { CapabilityList } from '@core';

export const accountCapabilities = [
  'account:read',
  'account:write',
  'account:create',
  'account:update',
  'account:list',
  'account:delete',
] as const satisfies CapabilityList<'account'>;
