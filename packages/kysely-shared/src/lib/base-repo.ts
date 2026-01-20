import { AppError } from '@zero/application-core';

export abstract class BaseRepo<TEntity, TKey extends readonly unknown[]> {
  public abstract get(...key: TKey): Promise<TEntity | undefined>;

  public abstract save(entity: TEntity): Promise<TEntity>;

  public abstract update(entity: TEntity): Promise<TEntity>;

  public async updateAll(entities: TEntity[]): Promise<TEntity[]> {
    for (const entity of entities) {
      await this.update(entity);
    }
    return entities;
  }

  public async require(...key: TKey): Promise<TEntity> {
    const entity = await this.get(...key);
    if (!entity) {
      throw new AppError('Entity not present in database');
    }
    return entity;
  }

  public async saveAll(entities: TEntity[]): Promise<TEntity[]> {
    for (const entity of entities) {
      await this.save(entity);
    }
    return entities;
  }
}
