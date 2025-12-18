import type { IPickQuery, IQuery, IQueryContext } from '@types';
import { BaseHandler } from './base-handler.ts';

export abstract class AbstractQueryHandler<
  TQueries extends IQuery<string>,
  TKey extends TQueries['query']['key']
> extends BaseHandler<TKey> {
  public canHandle(
    thing: IQuery<string>['query']
  ): thing is IPickQuery<TQueries, TKey>['query'] {
    return thing.key === this.name;
  }

  protected abstract handle(
    context: IQueryContext<TQueries, TKey>
  ): Promise<IPickQuery<TQueries, TKey>['response']>;

  public async doHandle(
    context: IQueryContext<TQueries, TKey>
  ): Promise<IPickQuery<TQueries, TKey>['response']> {
    return await this.handle(context);
  }
}
