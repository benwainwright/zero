export interface IReadRepository<TEntity, TKey extends readonly unknown[]> {
  get(...id: TKey): Promise<TEntity | undefined>;
  require(...id: TKey): Promise<TEntity>;
}
