import { selfCapabilities } from '../user/user-capabilities.ts';

export const capabilities = [...selfCapabilities];

export type ICapability = (typeof capabilities)[number];
