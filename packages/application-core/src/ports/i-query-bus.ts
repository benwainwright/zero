import type { IQuery } from '@types';

export interface IQueryBus {
  execute<TQuery extends IQuery<unknown>>(
    command: TQuery['query']
  ): Promise<TQuery['response']>;
}
