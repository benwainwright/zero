import type { DomainModel } from '@zero/domain';

export interface IWriteRepository<TEntity extends DomainModel<unknown>> {
  update(entity: TEntity): Promise<TEntity>;
  save(entity: TEntity): Promise<TEntity>;
  saveAll(entities: TEntity[]): Promise<TEntity[]>;
  delete(entity: TEntity): Promise<void>;
}
