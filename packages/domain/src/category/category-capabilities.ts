import type { ICapabilityList } from '@types';

export const categoryCapabilities = [
  `category:create`,
  `category:delete`,
  `category:read`,
  `category:update`,
  `category:list`,
] as const satisfies ICapabilityList<'category'>;
