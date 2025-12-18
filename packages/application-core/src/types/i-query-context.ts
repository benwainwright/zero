import type { AbstractQuery } from '@core';

export interface IQueryContext<TQuery extends AbstractQuery<string>> {
  query: TQuery;
}
