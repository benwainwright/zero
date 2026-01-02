import { roleCapabilities } from '@role/role-capabilities.ts';
import { userCapabilities, selfCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  'all',
  ...userCapabilities,
  ...selfCapabilities,
  ...roleCapabilities,
] as const;

export type ICapability = (typeof capabilities)[number];
