import { require } from '@core';

export abstract class BaseRepo<TEntity, TKey extends readonly unknown[]> {
  public abstract get(...key: TKey): Promise<TEntity | undefined>;
  public abstract save(entity: TEntity): Promise<TEntity>;

  public async require(...key: TKey): Promise<TEntity> {
    return require(await this.get(...key));
  }

  public async saveAll(tokens: TEntity[]): Promise<TEntity[]> {
    for (const token of tokens) {
      await this.save(token);
    }

    return tokens;
  }
}
