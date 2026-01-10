import { accountCapabilities } from '@account';
import { bankConnectionCaps } from '@bank-connection';
import { tokenCaps } from '@oauth-token';
import { roleCapabilities } from '@role/role-capabilities.ts';
import { userCapabilities, selfCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  'all',
  ...userCapabilities,
  ...selfCapabilities,
  ...accountCapabilities,
  ...tokenCaps,
  ...bankConnectionCaps,
  ...roleCapabilities,
] as const;

export type ICapability = (typeof capabilities)[number];
