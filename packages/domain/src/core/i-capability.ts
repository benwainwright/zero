import { accountCapabilities } from '@account';
import { bankConnectionCaps } from '@bank-connection';
import { tokenCaps } from '@oauth-token';
import { roleCapabilities } from '@role/role-capabilities.ts';
import { selfCapabilities, userCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  ...selfCapabilities,
  ...userCapabilities,
  ...accountCapabilities,
  ...roleCapabilities,
  ...bankConnectionCaps,
  ...tokenCaps,
];

export type ICapability = (typeof capabilities)[number];
