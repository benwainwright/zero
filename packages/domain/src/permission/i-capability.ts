import { userCapabilities, selfCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [
  'all',
  ...userCapabilities,
  ...selfCapabilities,
] as const;

export type ICapability = (typeof capabilities)[number];
