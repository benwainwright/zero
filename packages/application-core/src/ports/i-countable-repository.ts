export interface ICountableRepository<
  TScope extends Record<string, unknown> = Record<string, unknown>
> {
  count(
    ...scope: Record<string, unknown> extends TScope ? [] : [TScope]
  ): Promise<number>;
}
