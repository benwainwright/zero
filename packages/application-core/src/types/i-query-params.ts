import type { IQuery } from './i-query.ts';

export type IQueryParams<TQuery extends IQuery<string>> = TQuery extends {
  params: infer TParams;
}
  ? TParams extends undefined
    ? []
    : [params: TParams]
  : [];
