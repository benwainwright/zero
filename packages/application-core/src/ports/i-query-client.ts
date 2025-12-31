import type { IPickQuery, IQuery, IQueryParams } from '@types';

export interface IQueryClient<TQueries extends IQuery<string>> {
  execute<TQuery extends TQueries, TKey extends TQuery['key']>(
    key: TKey,
    ...params: IQueryParams<TQuery>
  ): Promise<IPickQuery<TQuery, TKey>['response']>;
}
