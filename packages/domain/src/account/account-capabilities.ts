import type { CapabilityList } from '@core';

export const accountCapabilities = [
  'account:read',
  'account:write',
  'account:create',
  'account:update',
  'account:list',
  'account:list-transactions',
  'account:delete-transaction',
  'account:update-transaction',
  'account:create-transaction',
  'account:delete',
] as const satisfies CapabilityList<'account'>;
