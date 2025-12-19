import { selfCapabilities, userCapabilities } from '@user/user-capabilities.ts';

export const capabilities = [...selfCapabilities, ...userCapabilities];

export type ICapability = (typeof capabilities)[number];
