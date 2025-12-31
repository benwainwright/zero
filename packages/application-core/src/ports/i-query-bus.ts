import type { IQuery } from '@types';

export interface IQueryBus {
  execute<TQuery extends IQuery<string>>(
    query: Omit<TQuery, 'response'>
  ): Promise<TQuery['response']>;
}
