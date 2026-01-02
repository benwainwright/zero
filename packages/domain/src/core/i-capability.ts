import { roleCapabilities } from '@role/role-capabilities.ts';
import { selfCapabilities, userCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  ...selfCapabilities,
  ...userCapabilities,
  ...roleCapabilities,
];

export type ICapability = (typeof capabilities)[number];
