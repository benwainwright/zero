import { userCapabilities } from '../user/user-capabilities.ts';

export const capabilities = [...userCapabilities];

export type ICapability = (typeof capabilities)[number];
