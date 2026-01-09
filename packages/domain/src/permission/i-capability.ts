import { accountCapabilities } from '@account';
import { roleCapabilities } from '@role/role-capabilities.ts';
import { userCapabilities, selfCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  'all',
  ...userCapabilities,
  ...selfCapabilities,
  ...accountCapabilities,
  ...roleCapabilities,
] as const;

export type ICapability = (typeof capabilities)[number];
