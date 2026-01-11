import type {
  IPickQuery,
  IQuery,
  IQueryContext,
  ITryHandleQueryResponse,
} from '@types';
import { BaseHandler } from './base-handler.ts';
import type { User } from '@zero/domain';
import type { IEventBus } from '@ports';

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
    events,
  }: {
    query: Omit<IQuery<string>, 'response'>;
    events: IEventBus;
    authContext: User | undefined;
  }): Promise<ITryHandleQueryResponse<IPickQuery<TQueries, TKey>['response']>> {
    if (this.canHandle(query)) {
      try {
        events.emit('QueryHandleStartEvent', {
          key: this.name,
          id: query.id,
        });
        return {
          response: await this.handle({
            query: query.params,
            authContext,
            id: query.id,
          }),
          handled: true,
        };
      } finally {
        events.emit('QueryHandleCompleteEvent', {
          key: this.name,
          id: query.id,
        });
      }
    }

    return {
      handled: false,
    };
  }
}
