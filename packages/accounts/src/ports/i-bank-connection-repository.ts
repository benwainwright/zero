import type { IReadRepository } from '@zero/application-core';
import type { BankConnection } from '@zero/domain';

export type IBankConnectionRepository = IReadRepository<
  BankConnection,
  [string]
>;
