interface IPageDetails {
  start: number;
  limit: number;
}

export interface IListRepository<
  TEntity,
  TScope extends Record<string, unknown> = Record<string, unknown>
> {
  list(
    ...scope: Record<string, unknown> extends TScope
      ? [IPageDetails]
      : [TScope & IPageDetails]
  ): Promise<TEntity[]>;
}
