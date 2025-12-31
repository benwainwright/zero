import type {
  IPickQuery,
  IQuery,
  IQueryContext,
  ITryHandleQueryResponse,
} from '@types';
import { BaseHandler } from './base-handler.ts';
import type { User } from '@zero/domain';

export abstract class AbstractQueryHandler<
  TQueries extends IQuery<string>,
  TKey extends TQueries['key']
> extends BaseHandler<TKey> {
  protected canHandle(
    thing: Omit<IQuery<string>, 'response'>
  ): thing is IPickQuery<TQueries, TKey> {
    return thing.key === this.name;
  }

  protected abstract handle(
    context: IQueryContext<IPickQuery<TQueries, TKey>>
  ): Promise<IPickQuery<TQueries, TKey>['response']>;

  public async tryHandle({
    query,
    authContext,
  }: {
    query: Omit<IQuery<string>, 'response'>;
    authContext: User | undefined;
  }): Promise<ITryHandleQueryResponse<IPickQuery<TQueries, TKey>['response']>> {
    if (this.canHandle(query)) {
      return {
        response: await this.handle({
          query: query.params,
          authContext,
          id: query.id,
        }),
        handled: true,
      };
    }

    return {
      handled: false,
    };
  }
}
