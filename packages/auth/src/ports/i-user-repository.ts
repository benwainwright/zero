import type { IListRepository, IReadRepository } from '@zero/application-core';
import type { User } from '@zero/domain';

export type IUserRepository = IReadRepository<User, [string]> &
  IListRepository<User>;
