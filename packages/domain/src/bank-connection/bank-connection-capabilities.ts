import type { ICapabilityList } from '@types';

export const bankConnectionCaps = [
  `bank-connection:create`,
  `bank-connection:delete`,
  `bank-connection:read`,
  `bank-connection:update`,
] as const satisfies ICapabilityList<'bank-connection'>;
