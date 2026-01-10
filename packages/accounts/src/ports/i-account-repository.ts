import type { IListRepository, IReadRepository } from '@zero/application-core';
import type { Account } from '@zero/domain';

export type IAccountRepository = IReadRepository<Account, [string]> &
  IListRepository<Account, { userId: string }>;
