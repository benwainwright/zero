import type { IPickQuery } from './i-pick-query.ts';
import type { IQuery } from './i-query.ts';
import type { IBaseContext } from './i-base-context.ts';

export interface IQueryContext<
  TQueries extends IQuery<string>,
  TKey extends TQueries['query']['key']
> extends IBaseContext {
  query: IPickQuery<TQueries, TKey>['query']['params'];
}
