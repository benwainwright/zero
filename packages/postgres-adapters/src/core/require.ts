import { AppError } from '@zero/application-core';

export const require = <TEntity>(entity: TEntity | undefined) => {
  if (!entity) {
    throw new AppError('Entity not present in database');
  }

  return entity;
};
