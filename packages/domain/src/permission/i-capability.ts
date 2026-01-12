import { accountCapabilities } from '@account';
import { bankConnectionCaps } from '@bank-connection';
import { categoryCapabilities } from '@category';
import { tokenCaps } from '@oauth-token';
import { roleCapabilities } from '@role/role-capabilities.ts';
import { userCapabilities, selfCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  'all',
  ...categoryCapabilities,
  ...userCapabilities,
  ...selfCapabilities,
  ...accountCapabilities,
  ...tokenCaps,
  ...bankConnectionCaps,
  ...roleCapabilities,
] as const;

export type ICapability = (typeof capabilities)[number];
