export interface IBulkGetRepository<TEntity> {
  getMany(id: string[]): Promise<TEntity[]>;
}
