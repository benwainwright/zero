import type { IListRepository, IReadRepository } from '@zero/application-core';
import type { Role } from '@zero/domain';

export type IRoleRepository = IReadRepository<Role, [string]> &
  IListRepository<Role>;
