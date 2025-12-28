import type { IQuery } from '@types';

export interface IQueryClient<TQueries extends IQuery<string>> {
  execute<TQuery extends TQueries>(
    query: Omit<TQuery['query'], 'id'>
  ): Promise<TQuery['response']>;
}
