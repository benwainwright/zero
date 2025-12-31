import type { IQuery } from './i-query.ts';

export type IPickQuery<
  TQueries extends IQuery<string>,
  TKey extends TQueries['key'] = string
> = Extract<TQueries, { key: TKey }>;
