export interface IUnpagedListRepository<
  TEntity,
  TScope extends Record<string, unknown> = Record<string, unknown>
> {
  listAll(
    ...scope: Record<string, unknown> extends TScope ? [] : [TScope]
  ): Promise<TEntity[]>;
}
