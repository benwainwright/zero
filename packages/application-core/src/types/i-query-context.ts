import type { IQuery } from './i-query.ts';
import type { IBaseContext } from './i-base-context.ts';

export interface IQueryContext<TQuery extends IQuery<string>>
  extends IBaseContext {
  query: TQuery['params'];
}
