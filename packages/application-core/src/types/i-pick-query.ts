import type { IQuery } from './i-query.ts';

export type IPickQuery<
  TQueries extends IQuery<string>,
  TKey extends TQueries['query']['key'] = string
> = Extract<TQueries, { query: { key: TKey } }>;
