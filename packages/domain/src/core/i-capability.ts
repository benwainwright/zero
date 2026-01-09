import { accountCapabilities } from '@account';
import { roleCapabilities } from '@role/role-capabilities.ts';
import { selfCapabilities, userCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  ...selfCapabilities,
  ...userCapabilities,
  ...accountCapabilities,
  ...roleCapabilities,
];

export type ICapability = (typeof capabilities)[number];
