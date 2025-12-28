import type { IQuery } from '@types';

export interface IQueryClient {
  execute<TQuery extends IQuery<string>>(
    query: Omit<TQuery['query'], 'id'>
  ): Promise<TQuery['response']>;
}
