import type { IQuery } from '@types';

export interface IQueryBus {
  execute<TQuery extends IQuery<string>>(
    query: TQuery['query']
  ): Promise<TQuery['response']>;
}
