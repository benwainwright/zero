import type { IQueryParamsOrUndefined } from './i-query-params-or-undefined.ts';
import type { IQuery } from './i-query.ts';

export type IQueryParams<TQuery extends IQuery<string>> =
  IQueryParamsOrUndefined<TQuery> extends undefined
    ? []
    : [params: IQueryParamsOrUndefined<TQuery>];
