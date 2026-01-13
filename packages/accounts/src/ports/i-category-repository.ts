import type {
  IListRepository,
  IReadRepository,
  IUnpagedListRepository,
} from '@zero/application-core';
import type { Category } from '@zero/domain';

export type ICategoryRepository = IReadRepository<Category, [string]> &
  IListRepository<Category, { userId: string }> &
  IUnpagedListRepository<Category, { userId: string }>;
